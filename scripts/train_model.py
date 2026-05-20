import pandas as pd
import numpy as np
import json
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, average_precision_score,
    precision_score, recall_score, confusion_matrix, precision_recall_curve,
    roc_curve
)
import xgboost as xgb

# Load data
print("Loading data...")
df = pd.read_csv('output/final_fused_dataset.csv')
print(f"Dataset shape: {df.shape}")
print(f"Class distribution:\n{df['Revenue'].value_counts().to_string()}")

# Identify features based on actual columns
numerical_features = ['PageValues', 'BounceRates', 'ExitRates', 'ProductRelated',
                     'Administrative', 'avg_sentiment', 'total_engagement',
                     'positive_ratio', 'engagement_norm', 'global_avg_price']
categorical_features = ['Month', 'OperatingSystems', 'Browser', 'Region',
                       'TrafficType', 'VisitorType', 'Weekend']
target = 'Revenue'

# Verify columns exist
all_features = numerical_features + categorical_features
missing_cols = [col for col in all_features if col not in df.columns]
if missing_cols:
    print(f"Warning: Missing columns {missing_cols}")
    numerical_features = [col for col in numerical_features if col in df.columns]
    categorical_features = [col for col in categorical_features if col in df.columns]
    all_features = numerical_features + categorical_features

print(f"Using {len(numerical_features)} numerical and {len(categorical_features)} categorical features")

X = df[all_features]
y = df[target]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Build preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_features)
    ])

# Calculate scale_pos_weight for imbalance handling
neg_count = (y_train == 0).sum()
pos_count = (y_train == 1).sum()
scale_weight = neg_count / pos_count
print(f"\nClass imbalance ratio (neg/pos): {scale_weight:.2f}")
print(f"Negative samples: {neg_count}, Positive samples: {pos_count}")

# Models to train
models = {
    'Logistic Regression': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(max_iter=1000))
    ]),
    'Random Forest': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ]),
    'XGBoost': Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', xgb.XGBClassifier(
            random_state=42,
            eval_metric='logloss',
            scale_pos_weight=scale_weight
        ))
    ])
}

# Train and evaluate with cross-validation
best_model = None
best_score = 0
results = {}

print("\nTraining models with 5-Fold Cross-Validation...")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for name, model in models.items():
    print(f"\n{'='*50}")
    print(f"Training {name}...")

    # Fit on train set
    model.fit(X_train, y_train)

    # Test set predictions
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    # Calculate metrics
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    pr_auc = average_precision_score(y_test, y_prob)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred).tolist()

    # ROC curve data for visualization
    fpr, tpr, _ = roc_curve(y_test, y_prob)

    # Cross-validation scores
    cv_roc_auc = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
    cv_f1 = cross_val_score(model, X, y, cv=cv, scoring='f1')
    cv_pr_auc = cross_val_score(model, X, y, cv=cv, scoring='average_precision')

    # Store results
    results[name] = {
        'accuracy': float(acc),
        'f1': float(f1),
        'roc_auc': float(roc_auc),
        'pr_auc': float(pr_auc),
        'precision': float(precision),
        'recall': float(recall),
        'confusion_matrix': cm,
        'cv_roc_auc_mean': float(cv_roc_auc.mean()),
        'cv_roc_auc_std': float(cv_roc_auc.std()),
        'cv_f1_mean': float(cv_f1.mean()),
        'cv_f1_std': float(cv_f1.std()),
        'cv_pr_auc_mean': float(cv_pr_auc.mean()),
        'cv_pr_auc_std': float(cv_pr_auc.std()),
        'roc_curve': {
            'fpr': [round(x, 4) for x in fpr.tolist()],
            'tpr': [round(x, 4) for x in tpr.tolist()]
        }
    }

    print(f"  Test Set Metrics:")
    print(f"    Accuracy:  {acc:.4f}")
    print(f"    F1-Score:  {f1:.4f}")
    print(f"    ROC-AUC:   {roc_auc:.4f}")
    print(f"    PR-AUC:    {pr_auc:.4f}")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall:    {recall:.4f}")
    print(f"  Cross-Validation (5-fold):")
    print(f"    ROC-AUC:   {cv_roc_auc.mean():.4f} (+/- {cv_roc_auc.std():.4f})")
    print(f"    F1-Score:  {cv_f1.mean():.4f} (+/- {cv_f1.std():.4f})")
    print(f"    PR-AUC:    {cv_pr_auc.mean():.4f} (+/- {cv_pr_auc.std():.4f})")
    print(f"  Confusion Matrix:")
    print(f"    TN={cm[0][0]}, FP={cm[0][1]}")
    print(f"    FN={cm[1][0]}, TP={cm[1][1]}")

    if cv_roc_auc.mean() > best_score:
        best_score = cv_roc_auc.mean()
        best_model = model
        best_model_name = name

# Threshold tuning for best model
print(f"\n{'='*50}")
print(f"Threshold Tuning for {best_model_name}...")

y_prob_test = best_model.predict_proba(X_test)[:, 1]
precision_vals, recall_vals, thresholds = precision_recall_curve(y_test, y_prob_test)

# Find optimal threshold (maximize F1)
f1_scores = 2 * (precision_vals * recall_vals) / (precision_vals + recall_vals + 1e-10)
optimal_idx = np.argmax(f1_scores)
optimal_threshold = thresholds[optimal_idx] if optimal_idx < len(thresholds) else 0.5
optimal_f1 = f1_scores[optimal_idx]

print(f"Default threshold (0.5) F1: {f1_score(y_test, (y_prob_test >= 0.5).astype(int)):.4f}")
print(f"Optimal threshold: {optimal_threshold:.4f}")
print(f"Optimal F1-Score: {optimal_f1:.4f}")

# Apply optimal threshold
y_pred_optimal = (y_prob_test >= optimal_threshold).astype(int)
acc_opt = accuracy_score(y_test, y_pred_optimal)
prec_opt = precision_score(y_test, y_pred_optimal)
rec_opt = recall_score(y_test, y_pred_optimal)
cm_opt = confusion_matrix(y_test, y_pred_optimal).tolist()

print(f"Metrics with optimal threshold:")
print(f"  Accuracy:  {acc_opt:.4f}")
print(f"  Precision: {prec_opt:.4f}")
print(f"  Recall:    {rec_opt:.4f}")

# Save optimal threshold
threshold_data = {
    'optimal_threshold': float(optimal_threshold),
    'optimal_f1': float(optimal_f1),
    'precision_at_optimal': float(prec_opt),
    'recall_at_optimal': float(rec_opt),
    'accuracy_at_optimal': float(acc_opt),
    'confusion_matrix_optimal': cm_opt
}
with open('models/optimal_threshold.json', 'w') as f:
    json.dump(threshold_data, f, indent=2)
print("Saved: models/optimal_threshold.json")

# Update best model metrics with optimal threshold
results[best_model_name]['optimal_threshold'] = threshold_data

# Save best model (entire Pipeline)
print(f"\n{'='*50}")
print(f"Best model: {best_model_name} (CV ROC-AUC: {best_score:.4f})")
joblib.dump(best_model, 'models/model.pkl')
print("Saved: models/model.pkl")

# Save feature schema
feature_schema = {
    'numerical_features': numerical_features,
    'categorical_features': categorical_features,
    'target': target,
    'all_features': all_features
}
with open('models/features.json', 'w') as f:
    json.dump(feature_schema, f, indent=2)
print("Saved: models/features.json")

# Save model metadata
metadata = {
    'model_type': best_model_name,
    'version': '1.1.0',
    'training_date': datetime.now().strftime('%Y-%m-%d'),
    'metrics': results[best_model_name],
    'dataset_version': 'final_fused_dataset_v1',
    'features_count': len(all_features),
    'class_imbalance_ratio': float(scale_weight),
    'cross_validation': {
        'folds': 5,
        'stratified': True
    }
}
with open('models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("Saved: models/metadata.json")

# Save evaluation report
report = {
    'best_model': best_model_name,
    'results': results,
    'selected_metrics': results[best_model_name],
    'optimal_threshold': threshold_data
}
with open('models/evaluation_report.json', 'w') as f:
    json.dump(report, f, indent=2)
print("Saved: models/evaluation_report.json")

print("\n✅ Model upgrade complete!")
print(f"✅ Added: scale_pos_weight={scale_weight:.2f}")
print(f"✅ Added: 5-Fold Cross-Validation")
print(f"✅ Added: Threshold tuning (optimal={optimal_threshold:.4f})")
print(f"✅ Added: PR-AUC, Precision, Recall, Confusion Matrix")
