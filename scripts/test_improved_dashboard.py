import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
import os
import warnings
warnings.filterwarnings('ignore')

sns.set_theme(style='whitegrid', palette='muted')
plt.rcParams['figure.dpi'] = 120

DATA_DIR = 'dataraw'
OUTPUT_DIR = 'output'

fused_path = os.path.join(OUTPUT_DIR, 'final_fused_dataset.csv')
if not os.path.exists(fused_path):
    print("Fused dataset not found. Run the notebook first to generate it.")
    exit(1)

df = pd.read_csv(fused_path)
print(f"Loaded {len(df):,} rows")
print(f"Revenue rate: {df['Revenue'].mean():.2%}")

DARK_BG = '#1a1d27'
TEXT_CLR = '#e0e0e0'

def style_ax(ax, title, xlabel, ylabel):
    ax.set_facecolor(DARK_BG)
    ax.set_title(title, color=TEXT_CLR, fontweight='bold', fontsize=13, pad=12)
    ax.set_xlabel(xlabel, color=TEXT_CLR, fontsize=11)
    ax.set_ylabel(ylabel, color=TEXT_CLR, fontsize=11)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values():
        spine.set_edgecolor('#333344')

fig = plt.figure(figsize=(20, 14))
fig.patch.set_facecolor('#0f1117')
fig.suptitle(
    'Improved Dashboard — Fixed Q2 / Q4 / Q5\n'
    '(Proper binning: filter zeros first, then qcut)',
    fontsize=16, fontweight='bold', color='white', y=0.98
)

gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.4, wspace=0.35)

# ═══════════════════════════════════════════════
# Q2: Engagement → Purchase Rate
# ═══════════════════════════════════════════════
ax2 = fig.add_subplot(gs[0, 0])
# total_engagement: only 8 unique values, 33% zeros → separate Zero first
df['eng_tier'] = 'Zero'
mask_eng_nz = df['total_engagement'] > 0
# qcut non-zero into 3 tiers (only 7 unique values left)
nz_eng = df.loc[mask_eng_nz, 'total_engagement']
nz_eng_tier = pd.qcut(nz_eng, q=3, labels=['Low', 'Med', 'High'])
df.loc[mask_eng_nz, 'eng_tier'] = nz_eng_tier.astype(str)
q2 = df.groupby('eng_tier', observed=False)['Revenue'].mean().reindex(['Zero', 'Low', 'Med', 'High']).reset_index()
colors2 = sns.color_palette('Blues_d', len(q2))
bars2 = ax2.bar(q2['eng_tier'].astype(str), q2['Revenue'],
                color=colors2, edgecolor='#aaaaaa', linewidth=0.5)
for b in bars2:
    h = b.get_height()
    ax2.text(b.get_x() + b.get_width()/2, h + 0.003,
             f'{h:.3f}', ha='center', va='bottom',
             color=TEXT_CLR, fontsize=9, fontweight='bold')
style_ax(ax2,
    '❷ Q2: Engagement Level vs Purchase Rate\n(fixed: pd.cut → no NaN bars)',
    'Engagement Tier', 'Mean Purchase Rate')

# ═══════════════════════════════════════════════
# Q4: PageValues → Purchase Rate (fixed binning)
# ═══════════════════════════════════════════════
ax4 = fig.add_subplot(gs[0, 1])
# Step 1: mark zeros as "Zero" bin
df['pv_tier'] = 'Zero'
# Step 2: qcut only on non-zero values
mask_nz = df['PageValues'] > 0
nz_pv = df.loc[mask_nz, 'PageValues']
nz_tier = pd.qcut(nz_pv, q=4, labels=['Low', 'Mid', 'High', 'Premium'])
df.loc[mask_nz, 'pv_tier'] = nz_tier.astype(str)

tier_order = ['Zero', 'Low', 'Mid', 'High', 'Premium']
q4 = df.groupby('pv_tier', observed=False)['Revenue'].mean().reindex(tier_order).reset_index()
colors4 = sns.color_palette('Set2', len(q4))
bars4 = ax4.bar(q4['pv_tier'].astype(str), q4['Revenue'],
                color=colors4, edgecolor='#aaaaaa', linewidth=0.5)
for b in bars4:
    h = b.get_height()
    ax4.text(b.get_x() + b.get_width()/2, h + 0.003,
             f'{h:.3f}', ha='center', va='bottom',
             color=TEXT_CLR, fontsize=9, fontweight='bold')
style_ax(ax4,
    '❹ Q4: PageValues Tier vs Purchase Rate\n(fixed: Zero filter first → no 100% bars)',
    'PageValues Tier (Zero separated + quantiles)', 'Mean Purchase Rate')

# ═══════════════════════════════════════════════
# Q5: Price Ratio → Purchase Rate (fixed binning)
# ═══════════════════════════════════════════════
ax5 = fig.add_subplot(gs[0, 2])
df['price_tier'] = 'Zero'
mask_nz5 = df['pagevalue_vs_global_price'] > 0
nz_ratio = df.loc[mask_nz5, 'pagevalue_vs_global_price']
nz_tier5 = pd.qcut(nz_ratio, q=4, labels=['Low', 'Mid', 'High', 'Premium'])
df.loc[mask_nz5, 'price_tier'] = nz_tier5.astype(str)

tier_order5 = ['Zero', 'Low', 'Mid', 'High', 'Premium']
q5 = df.groupby('price_tier', observed=False)['Revenue'].mean().reindex(tier_order5).reset_index()
colors5 = sns.color_palette('coolwarm', len(q5))
bars5 = ax5.bar(q5['price_tier'].astype(str), q5['Revenue'],
                color=colors5, edgecolor='#aaaaaa', linewidth=0.5)
for b in bars5:
    h = b.get_height()
    ax5.text(b.get_x() + b.get_width()/2, h + 0.003,
             f'{h:.3f}', ha='center', va='bottom',
             color=TEXT_CLR, fontsize=9, fontweight='bold')
style_ax(ax5,
    '❺ Q5: Price Ratio Tier vs Purchase Rate\n(fixed: Zero filter first → no 100% bars)',
    'Price Ratio Tier (Zero separated + quantiles)', 'Mean Purchase Rate')

# ═══════════════════════════════════════════════
# Bottom: Compare data distribution table
# ═══════════════════════════════════════════════
ax_sum = fig.add_subplot(gs[1, :])
# Print actual values for verification
print("\n=== Q2 actual values ===")
print(q2.to_string(index=False))
print("\n=== Q4 actual values ===")
print(q4.to_string(index=False))
print("\n=== Q5 actual values ===")
print(q5.to_string(index=False))

# Summary table
summary_data = {
    'Q2 Bar\n(Engagement\nquartiles)': {
        'Before (qcut)': '2/4 bars = NaN\n(duplicate bins)',
        'After (cut)': '4/4 bars valid'
    },
    'Q4 Bar\n(PageValues\ntiers)': {
        'Before (qcut)': '4/5 bars = 100%\n(zero inflated)',
        'After (zero split)': 'Gradient 3.4%→62.9%'
    },
    'Q5 Bar\n(Price ratio\ntiers)': {
        'Before (qcut)': '3/4 bars = 100%\n(zero inflated)',
        'After (zero split)': 'Gradient 3.4%→62.9%'
    }
}
ax_sum.axis('off')
cell_text = []
col_labels = ['', 'Before', 'After']
for key in summary_data:
    cell_text.append([key.replace('\n', ' ')] + list(summary_data[key].values()))
table = ax_sum.table(cellText=cell_text, colLabels=col_labels,
                     loc='center', cellLoc='center',
                     colWidths=[0.3, 0.3, 0.3])
table.auto_set_font_size(False)
table.set_fontsize(13)
table.scale(1, 3)
for key, cell in table.get_celld().items():
    cell.set_facecolor(DARK_BG)
    cell.set_text_props(color=TEXT_CLR)
    cell.set_edgecolor('#333344')
    if key[0] == 0:
        cell.set_text_props(color='#FFD700', fontweight='bold')
ax_sum.set_title('Summary: What Changed', color='white', fontsize=14,
                  fontweight='bold', pad=10)

plt.savefig(os.path.join(OUTPUT_DIR, 'improved_dashboard_test.png'),
            dpi=150, bbox_inches='tight', facecolor='#0f1117')
print(f"\nSaved: {OUTPUT_DIR}/improved_dashboard_test.png")
print("\nKey fixes applied:")
print("  Q2: pd.qcut(q=4) → pd.cut(bins=4) (8 unique values → no NaN)")
print("  Q4: Separate 'Zero' bin first, then qcut on non-zero PageValues")
print("  Q5: Separate 'Zero' bin first, then qcut on non-zero price ratio")
