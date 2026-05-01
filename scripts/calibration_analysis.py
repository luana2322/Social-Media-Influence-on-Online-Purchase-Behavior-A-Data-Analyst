import pandas as pd
import numpy as np
import joblib
import json
from sklearn.calibration import calibration_curve, CalibratedClassifierCV
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Load model and data
print("Loading model and data...")
model = joblib.load('models/model.pkl')

df = pd.read_csv('output/final_fused_dataset.csv')
print(f"Dataset shape: {df.shape}")

# Load feature schema
with open('models/features.json', 'r') as f:
    features_schema = json.load(f)

numerical_features = features_schema['numerical_features']
categorical_features = features_schema['categorical_features']
all_features = features_schema['all_features']
target = features_schema['target']

X = df[all_features]
y = df[target]

# Split data (same as training)
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Get predictions
y_prob = model.predict_proba(X_test)[:, 1]

# Calibration analysis
print("\n" + "="*50)
print("CALIBRATION ANALYSIS")
print("="*50)

# Calculate calibration curve
prob_true, prob_pred = calibration_curve(y_test, y_prob, n_bins=10)

print("\nCalibration Curve Data:")
print(f"{'Predicted Prob':<20} {'Actual Freq':<20} {'Samples':<10}")
print("-" * 50)
for i in range(len(prob_true)):
    # Count samples in this bin
    bin_lower = prob_pred[i] - (prob_pred[1] - prob_pred[0])/2 if i > 0 else prob_pred[i]/2
    bin_upper = prob_pred[i] + (prob_pred[1] - prob_pred[0])/2 if i < len(prob_pred)-1 else prob_pred[i] + (1-prob_pred[i])/2
    n_samples = ((y_prob >= bin_lower) & (y_prob < bin_upper)).sum()
    if n_samples > 0:
        print(f"{prob_pred[i]:<20.4f} {prob_true[i]:<20.4f} {n_samples:<10}")

# Calculate Expected Calibration Error (ECE)
def calculate_ece(y_true, y_prob, n_bins=10):
    bins = np.linspace(0, 1, n_bins + 1)
    ece = 0
    for i in range(n_bins):
        mask = (y_prob >= bins[i]) & (y_prob < bins[i+1])
        if mask.sum() > 0:
            bin_acc = np.abs(y_true[mask].mean() - y_prob[mask].mean())
            ece += (mask.sum() / len(y_true)) * bin_acc
    return ece

ece = calculate_ece(y_test.values, y_prob)
print(f"\nExpected Calibration Error (ECE): {ece:.4f}")

# Interpretation
if ece < 0.05:
    print("✅ Model is well-calibrated (ECE < 0.05)")
elif ece < 0.10:
    print("⚠️  Model is moderately calibrated (0.05 < ECE < 0.10)")
else:
    print("❌ Model is poorly calibrated (ECE > 0.10)")
    print("   Consider applying isotonic regression or Platt scaling")

# Check probability distribution
print("\nProbability Distribution:")
print(f"  Mean: {y_prob.mean():.4f}")
print(f"  Std:  {y_prob.std():.4f}")
print(f"  Min:  {y_prob.min():.4f}")
print(f"  Max:  {y_prob.max():.4f}")

# Check if high probabilities actually convert
high_prob_mask = y_prob > 0.8
if high_prob_mask.sum() > 0:
    actual_rate_high = y_test[high_prob_mask].mean()
    print(f"\nFor predictions > 0.8:")
    print(f"  Count: {high_prob_mask.sum()}")
    print(f"  Actual conversion rate: {actual_rate_high:.4f}")
    print(f"  Average predicted prob: {y_prob[high_prob_mask].mean():.4f}")

# Save calibration results
calibration_data = {
    'ece': float(ece),
    'calibration_curve': {
        'prob_pred': prob_pred.tolist(),
        'prob_true': prob_true.tolist()
    },
    'probability_distribution': {
        'mean': float(y_prob.mean()),
        'std': float(y_prob.std()),
        'min': float(y_prob.min()),
        'max': float(y_prob.max())
    },
    'interpretation': 'well-calibrated' if ece < 0.05 else 'moderate' if ece < 0.10 else 'poor'
}

with open('models/calibration_report.json', 'w') as f:
    json.dump(calibration_data, f, indent=2)
print("\nSaved: models/calibration_report.json")

# Create calibration plot
plt.figure(figsize=(8, 6))
plt.plot(prob_pred, prob_true, 'o-', label='Calibration curve')
plt.plot([0, 1], [0, 1], 'k--', label='Perfect calibration')
plt.xlabel('Predicted Probability')
plt.ylabel('Actual Frequency')
plt.title(f'Calibration Plot (ECE = {ece:.4f})')
plt.legend()
plt.grid(True)
plt.savefig('models/calibration_plot.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: models/calibration_plot.png")

print("\n✅ Calibration analysis complete!")
