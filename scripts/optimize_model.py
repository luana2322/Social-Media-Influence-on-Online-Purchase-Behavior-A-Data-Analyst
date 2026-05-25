import pandas as pd
import numpy as np
import json
import joblib
import warnings
import os
from datetime import datetime
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, average_precision_score,
    precision_score, recall_score, confusion_matrix, precision_recall_curve,
    roc_curve
)
from sklearn.calibration import calibration_curve, CalibratedClassifierCV
import xgboost as xgb

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

# ── Load Data ──
print("Loading data...")
df = pd.read_csv('output/final_fused_dataset.csv')
print(f"Dataset shape: {df.shape}")
print(f"Class distribution:\n{df['Revenue'].value_counts().to_string()}")
pos_rate = df['Revenue'].mean()
print(f"Positive rate: {pos_rate:.4f}")

# ── Features (keep original 17 for compatibility) ──
numerical_features = ['PageValues', 'BounceRates', 'ExitRates', 'ProductRelated',
                     'Administrative', 'avg_sentiment', 'total_engagement',
                     'positive_ratio', 'engagement_norm', 'global_avg_price']
categorical_features = ['Month', 'OperatingSystems', 'Browser', 'Region',
                       'TrafficType', 'VisitorType', 'Weekend']
target = 'Revenue'
all_features = numerical_features + categorical_features

X = df[all_features]
y = df[target]

# ── Split ──
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE
)
print(f"Train: {len(X_train)}, Test: {len(X_test)}")

# ── Preprocessor ──
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'),
         categorical_features)
    ])

neg_count = (y_train == 0).sum()
pos_count = (y_train == 1).sum()
scale_weight = neg_count / pos_count
print(f"Class imbalance: {scale_weight:.2f}")

# ── 1. Raw XGBoost (baseline) ──
print("\n" + "=" * 60)
print("1. Raw XGBoost (baseline)")
print("=" * 60)
raw_model = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', xgb.XGBClassifier(
        random_state=RANDOM_STATE, eval_metric='logloss',
        scale_pos_weight=scale_weight, n_jobs=-1
    ))
])
raw_model.fit(X_train, y_train)
raw_probs = raw_model.predict_proba(X_test)[:, 1]
raw_roc = roc_auc_score(y_test, raw_probs)
raw_pr = average_precision_score(y_test, raw_probs)

# Calibration
prob_true_raw, prob_pred_raw = calibration_curve(y_test, raw_probs, n_bins=10)
def ece(y_true, y_prob, bins=10):
    b = np.linspace(0, 1, bins + 1)
    e = 0
    for i in range(bins):
        m = (y_prob >= b[i]) & (y_prob < b[i+1])
        if m.sum() > 0:
            e += (m.sum() / len(y_true)) * abs(y_true[m].mean() - y_prob[m].mean())
    return e
raw_ece = ece(y_test.values, raw_probs)
print(f"  ROC-AUC: {raw_roc:.4f}, PR-AUC: {raw_pr:.4f}, ECE: {raw_ece:.4f}")

# ── 2. XGBoost + Isotonic Calibration ──
print("\n" + "=" * 60)
print("2. XGBoost + Isotonic Calibration")
print("=" * 60)
iso_model = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', CalibratedClassifierCV(
        estimator=xgb.XGBClassifier(
            random_state=RANDOM_STATE, eval_metric='logloss',
            scale_pos_weight=scale_weight, n_jobs=-1
        ),
        method='isotonic', cv=5
    ))
])
iso_model.fit(X_train, y_train)
iso_probs = iso_model.predict_proba(X_test)[:, 1]
iso_roc = roc_auc_score(y_test, iso_probs)
iso_pr = average_precision_score(y_test, iso_probs)
iso_ece = ece(y_test.values, iso_probs)
print(f"  ROC-AUC: {iso_roc:.4f}, PR-AUC: {iso_pr:.4f}, ECE: {iso_ece:.4f}")

# ── 3. XGBoost + Sigmoid Calibration ──
print("\n" + "=" * 60)
print("3. XGBoost + Sigmoid Calibration (Platt Scaling)")
print("=" * 60)
sig_model = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', CalibratedClassifierCV(
        estimator=xgb.XGBClassifier(
            random_state=RANDOM_STATE, eval_metric='logloss',
            scale_pos_weight=scale_weight, n_jobs=-1
        ),
        method='sigmoid', cv=5
    ))
])
sig_model.fit(X_train, y_train)
sig_probs = sig_model.predict_proba(X_test)[:, 1]
sig_roc = roc_auc_score(y_test, sig_probs)
sig_pr = average_precision_score(y_test, sig_probs)
sig_ece = ece(y_test.values, sig_probs)
print(f"  ROC-AUC: {sig_roc:.4f}, PR-AUC: {sig_pr:.4f}, ECE: {sig_ece:.4f}")

# ── Select Best (by ECE, tie-break by ROC-AUC) ──
print("\n" + "=" * 60)
print("Model Comparison")
print("=" * 60)

models = {
    'Raw XGBoost': (raw_model, raw_probs, raw_roc, raw_pr, raw_ece),
    'XGBoost + Isotonic': (iso_model, iso_probs, iso_roc, iso_pr, iso_ece),
    'XGBoost + Sigmoid': (sig_model, sig_probs, sig_roc, sig_pr, sig_ece),
}

for name, (_, probs, roc, pr, ece_val) in models.items():
    f1_def = f1_score(y_test, (probs >= 0.5).astype(int))
    print(f"  {name:25s}  ROC-AUC={roc:.4f}  PR-AUC={pr:.4f}  F1={f1_def:.4f}  ECE={ece_val:.4f}")

# Sort by ECE ascending, then ROC-AUC descending
best_name = sorted(models, key=lambda k: (models[k][4], -models[k][2]))[0]
best_model, best_probs, best_roc, best_pr, best_ece = models[best_name]
print(f"\n🏆 Best: {best_name}")

# ── Threshold Tuning ──
print("\n" + "=" * 60)
print("Threshold Tuning")
print("=" * 60)
precision_vals, recall_vals, thresholds = precision_recall_curve(y_test, best_probs)
f1_scores = 2 * (precision_vals * recall_vals) / (precision_vals + recall_vals + 1e-10)
opt_idx = np.argmax(f1_scores)
opt_threshold = thresholds[opt_idx] if opt_idx < len(thresholds) else 0.5
opt_f1 = f1_scores[opt_idx]

y_pred_opt = (best_probs >= opt_threshold).astype(int)
acc = accuracy_score(y_test, y_pred_opt)
prec = precision_score(y_test, y_pred_opt)
rec = recall_score(y_test, y_pred_opt)
cm = confusion_matrix(y_test, y_pred_opt)

def_f1 = f1_score(y_test, (best_probs >= 0.5).astype(int))
print(f"  Default threshold (0.5) F1: {def_f1:.4f}")
print(f"  Optimal threshold: {opt_threshold:.4f}")
print(f"  Optimal F1: {opt_f1:.4f}")
print(f"  Accuracy: {acc:.4f}")
print(f"  Precision: {prec:.4f}")
print(f"  Recall: {rec:.4f}")
print(f"  Confusion Matrix:")
print(f"    TN={cm[0][0]}, FP={cm[0][1]}")
print(f"    FN={cm[1][0]}, TP={cm[1][1]}")

# ── Cross-Validation ──
print("\n" + "=" * 60)
print("5-Fold Cross-Validation")
print("=" * 60)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
cv_roc = cross_val_score(best_model, X, y, cv=cv, scoring='roc_auc')
cv_f1 = cross_val_score(best_model, X, y, cv=cv, scoring='f1')
cv_pr = cross_val_score(best_model, X, y, cv=cv, scoring='average_precision')
print(f"  ROC-AUC: {cv_roc.mean():.4f} ± {cv_roc.std():.4f}")
print(f"  F1:      {cv_f1.mean():.4f} ± {cv_f1.std():.4f}")
print(f"  PR-AUC:  {cv_pr.mean():.4f} ± {cv_pr.std():.4f}")

# ── Calibration details ──
print("\n" + "=" * 60)
print("Calibration Curve")
print("=" * 60)
prob_true_best, prob_pred_best = calibration_curve(y_test, best_probs, n_bins=10)
print(f"  {'Predicted':<12} {'Actual':<12} {'Samples':<8}")
print(f"  {'-'*32}")
for i in range(len(prob_true_best)):
    bl = prob_pred_best[i] - (prob_pred_best[1] - prob_pred_best[0]) / 2 if i > 0 else 0
    bu = prob_pred_best[i] + (prob_pred_best[1] - prob_pred_best[0]) / 2 if i < len(prob_pred_best) - 1 else 1
    n = ((best_probs >= bl) & (best_probs < bu)).sum()
    if n > 0:
        print(f"  {prob_pred_best[i]:<12.4f} {prob_true_best[i]:<12.4f} {n:<8}")

# ── Save Model ──
print("\n" + "=" * 60)
print("Saving Model Artifacts")
print("=" * 60)
os.makedirs('models', exist_ok=True)

model_path = 'models/model.pkl'
joblib.dump(best_model, model_path)
print(f"  Saved: {model_path}")

feature_schema = {
    'numerical_features': numerical_features,
    'categorical_features': categorical_features,
    'target': target,
    'all_features': all_features,
}
with open('models/features.json', 'w') as f:
    json.dump(feature_schema, f, indent=2)
print(f"  Saved: models/features.json")

threshold_data = {
    'optimal_threshold': float(opt_threshold),
    'optimal_f1': float(opt_f1),
    'precision_at_optimal': float(prec),
    'recall_at_optimal': float(rec),
    'accuracy_at_optimal': float(acc),
    'confusion_matrix_optimal': cm.tolist(),
}
with open('models/optimal_threshold.json', 'w') as f:
    json.dump(threshold_data, f, indent=2)
print(f"  Saved: models/optimal_threshold.json")

calibration_method = 'none'
if 'Isotonic' in best_name:
    calibration_method = 'isotonic'
elif 'Sigmoid' in best_name:
    calibration_method = 'sigmoid'

calibration_section = {
    'ece': float(best_ece),
    'method': calibration_method,
}

metadata = {
    'model_type': 'XGBoost',
    'version': '1.2.0',
    'training_date': datetime.now().strftime('%Y-%m-%d'),
    'calibration': calibration_section,
    'features_count': len(all_features),
    'class_imbalance_ratio': float(scale_weight),
    'test_metrics': {
        'roc_auc': float(best_roc),
        'pr_auc': float(best_pr),
        'f1_default': float(def_f1),
        'f1_optimal': float(opt_f1),
        'optimal_threshold': float(opt_threshold),
        'accuracy': float(acc),
        'precision': float(prec),
        'recall': float(rec),
        'confusion_matrix': cm.tolist(),
    },
    'cross_validation': {
        'folds': 5,
        'stratified': True,
        'roc_auc_mean': float(cv_roc.mean()),
        'roc_auc_std': float(cv_roc.std()),
        'f1_mean': float(cv_f1.mean()),
        'f1_std': float(cv_f1.std()),
        'pr_auc_mean': float(cv_pr.mean()),
        'pr_auc_std': float(cv_pr.std()),
    },
    'dataset_version': 'final_fused_dataset_v1',
}
with open('models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print(f"  Saved: models/metadata.json")

report = {
    'best_model': best_name,
    'comparison': {
        name: {
            'roc_auc': float(roc),
            'pr_auc': float(pr),
            'ece': float(e),
            'f1_default': float(f1_score(y_test, (probs >= 0.5).astype(int))),
        }
        for name, (_, probs, roc, pr, e) in models.items()
    },
    'final_metrics': metadata,
}
with open('models/evaluation_report.json', 'w') as f:
    json.dump(report, f, indent=2)
print(f"  Saved: models/evaluation_report.json")

calibration_data = {
    'ece': float(best_ece),
    'calibration_curve': {
        'prob_pred': prob_pred_best.tolist(),
        'prob_true': prob_true_best.tolist(),
    },
    'probability_distribution': {
        'mean': float(best_probs.mean()),
        'std': float(best_probs.std()),
        'min': float(best_probs.min()),
        'max': float(best_probs.max()),
    },
    'interpretation': 'well-calibrated' if best_ece < 0.03 else 'moderate' if best_ece < 0.07 else 'needs improvement',
}
with open('models/calibration_report.json', 'w') as f:
    json.dump(calibration_data, f, indent=2)
print(f"  Saved: models/calibration_report.json")

# ── Summary ──
print(f"\n{'='*60}")
print("✅ OPTIMIZATION COMPLETE")
print(f"{'='*60}")
print(f"Before: ROC-AUC={raw_roc:.4f}  PR-AUC={raw_pr:.4f}  ECE={raw_ece:.4f}")
print(f"After:  ROC-AUC={best_roc:.4f}  PR-AUC={best_pr:.4f}  ECE={best_ece:.4f}")
print(f"Model:  {best_name}")
print(f"F1 (threshold=0.5): {def_f1:.4f}  (optimal): {opt_f1:.4f}")
print(f"Δ ECE:  {raw_ece - best_ece:+.4f}")
print(f"Δ F1:   {opt_f1 - f1_score(y_test, (raw_probs >= 0.5).astype(int)):+.4f}")
print(f"{'='*60}")
