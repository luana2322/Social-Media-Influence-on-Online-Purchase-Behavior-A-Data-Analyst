import pandas as pd
import numpy as np
import json
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
import xgboost as xgb

# Load data
print("Loading data...")
df = pd.read_csv('output/final_fused_dataset.csv')
print(f"Dataset shape: {df.shape}")

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
from sklearn.preprocessing import StandardScaler, OneHotEncoder

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(drop='first'), categorical_features)
    ])

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
        ('classifier', xgb.XGBClassifier(random_state=42, eval_metric='logloss'))
    ])
}

# Train and evaluate
best_model = None
best_score = 0
results = {}

print("\nTraining models...")
for name, model in models.items():
    print(f"Training {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    
    results[name] = {'accuracy': acc, 'f1': f1, 'roc_auc': roc_auc}
    print(f"  Accuracy: {acc:.4f}, F1: {f1:.4f}, ROC-AUC: {roc_auc:.4f}")
    
    if roc_auc > best_score:
        best_score = roc_auc
        best_model = model
        best_model_name = name

# Save best model (entire Pipeline)
print(f"\nBest model: {best_model_name} (ROC-AUC: {best_score:.4f})")
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
    'version': '1.0.0',
    'training_date': datetime.now().strftime('%Y-%m-%d'),
    'metrics': results[best_model_name],
    'dataset_version': 'final_fused_dataset_v1',
    'features_count': len(all_features)
}
with open('models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("Saved: models/metadata.json")

# Save evaluation report
report = {
    'best_model': best_model_name,
    'results': results,
    'selected_metrics': results[best_model_name]
}
with open('models/evaluation_report.json', 'w') as f:
    json.dump(report, f, indent=2)
print("Saved: models/evaluation_report.json")

print("\n✅ Phase 2 complete!")
