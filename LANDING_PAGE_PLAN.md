# Landing Page Implementation Plan

## 🎯 Goal

Replace the current dashboard homepage (`/`) with a high-converting landing page that clearly communicates the product value within 5 seconds:
- **What is this product?** AI Marketing Assistant & Purchase Prediction Platform
- **Who is it for?** Marketing teams, E-commerce businesses, Data analysts, Startup founders
- **What value does it provide?** Predicts customer purchases, segments users, provides AI-powered marketing strategies

---

## 📋 Current Situation

### Existing Structure
- **Current `/` page**: Dashboard with stats cards, charts, and recent jobs
- **Dashboard should move to**: `/dashboard`
- **Tech stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (base-nova), Recharts
- **Existing components**: `Sidebar.tsx`, `Header.tsx`, various UI components in `src/components/ui/`
- **i18n**: Already configured with English/Vietnamese (`src/i18n/translations.ts`, `LanguageProvider.tsx`)

---

## 🏗️ Implementation Plan

### 1. File Structure Changes

| Action | Current File | New File | Description |
|--------|---------------|----------|-------------|
| Modify | `src/app/page.tsx` | `src/app/page.tsx` | Replace dashboard with landing page |
| Create | - | `src/app/dashboard/page.tsx` | Move current dashboard here |
| Create | - | `src/components/landing/HeroSection.tsx` | Hero section component |
| Create | - | `src/components/landing/HowItWorks.tsx` | 3-step flow component |
| Create | - | `src/components/landing/DemoSection.tsx` | Interactive demo with mock data |
| Create | - | `src/components/landing/FeaturesSection.tsx` | 4 key features with icons |
| Create | - | `src/components/landing/ChatbotSection.tsx` | Chatbot preview with examples |
| Create | - | `src/components/landing/SocialProof.tsx` | Tech stack + stats |
| Create | - | `src/components/landing/CTASection.tsx` | Final CTA section |
| Modify | `src/components/Sidebar.tsx` | `src/components/Sidebar.tsx` | Hide/collapse on landing page |
| Modify | `src/components/Header.tsx` | `src/components/Header.tsx` | Simplify for landing (hide search) |
| Modify | `src/i18n/translations.ts` | `src/i18n/translations.ts` | Add landing page translations |

---

### 2. Hero Section (`HeroSection.tsx`)

#### Copywriting (CRITICAL)
```
Headline (Pain + Solution):
"Stop guessing which customers will buy"

Subheadline (How it works + Outcome):
"Predict purchase behavior instantly with AI. Increase conversions by 27% using intelligent customer segmentation."

Social Proof (small text below CTAs):
"Trusted by 500+ marketers"
```

#### Design
- **Background**: Full-width gradient (subtle blue to purple: `bg-gradient-to-br from-blue-50 to-purple-50`)
- **Heading**: Large, bold (`text-5xl md:text-7xl font-bold`)
- **Subheadline**: Gray text (`text-xl text-muted-foreground`)
- **CTAs**: Two buttons side-by-side
  - "Try Demo" (Primary button → scrolls to DemoSection)
  - "Upload Your Data" (Outline button → navigates to `/upload`)
- **Optional**: Small 3D illustration or abstract shapes (right side on desktop)

#### CTA Behavior
```typescript
// "Try Demo" button
const handleTryDemo = () => {
  document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
};

// "Upload Your Data" button
const handleUpload = () => {
  router.push('/upload');
};
```

---

### 3. How It Works Section (`HowItWorks.tsx`)

#### 3-Step Visual Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Step 1        │ → │   Step 2        │ → │   Step 3        │
│                  │    │                  │    │                  │
│  [Upload Icon]  │    │  [Brain Icon]   │    │  [Message Icon] │
│                  │    │                  │    │                  │
│  Upload CSV     │    │  AI Predicts    │    │  Get Insights   │
│  (10K-1M rows) │    │  Purchase prob  │    │  + Chat with AI │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Content
| Step | Icon (lucide-react) | Title | Description |
|------|---------------------|-------|-------------|
| 1 | `Upload` | Upload Your Data | Drag & drop your CSV file (10K to 1M rows) |
| 2 | `Brain` | AI Predicts | Our XGBoost model predicts purchase probability |
| 3 | `MessageSquare` | Get Insights | Receive AI-powered strategies via chatbot |

#### Design
- Responsive grid: `grid grid-cols-1 md:grid-cols-3 gap-8`
- Each step in a shadcn Card component
- Numbered badges (1, 2, 3) on each card
- Arrows between steps (hidden on mobile)

---

### 4. Demo Section (`DemoSection.tsx`) - CRITICAL

#### Purpose
Show value WITHOUT requiring upload. User sees sample prediction results instantly.

#### Components
**A. "Try Demo Dataset" Button**
- Primary button with `Play` icon
- On click: Populate table + chart with mock data
- Text: "Try Demo Dataset" / "See Sample Results"

**B. Sample Results Table**
| user_id | purchase_probability | segment |
|---------|---------------------|----------|
| 1001    | 0.87                | High     |
| 1002    | 0.45                | Medium   |
| 1003    | 0.12                | Low      |
| 1004    | 0.92                | High     |
| 1005    | 0.34                | Low      |

- Use shadcn `Table` component
- Color-code segments: High (green), Medium (yellow), Low (red)
- Show only 5-10 rows (not overwhelming)

**C. Segmentation Pie Chart**
- Use Recharts `PieChart` (already installed)
- Show distribution: High (35%), Medium (40%), Low (25%)
- Reuse existing `ChartContainer` from `src/components/ui/chart.tsx`

**D. Mini Use-Case**
```
"Increase conversion by 27% using AI segmentation"
- Highlight: "High segment converts at 2x rate"
- Show: Simple stat card with upward trend arrow
```

#### Mock Data Source
Use existing `src/lib/mock-data.ts` or create new demo-specific mock data:
```typescript
const demoResults = [
  { user_id: 1001, purchase_probability: 0.87, segment: 'High' },
  { user_id: 1002, purchase_probability: 0.45, segment: 'Medium' },
  // ... more rows
];
```

#### Section ID
```html
<section id="demo-section">...</section>
```
(This allows "Try Demo" button in hero to scroll here)

---

### 5. Features Section (`FeaturesSection.tsx`)

#### 4 Key Features (2x2 grid on desktop, 1-col on mobile)

| # | Icon | Title | One-sentence Explanation |
|---|------|-------|-------------------------|
| 1 | `Brain` | Purchase Prediction | ML model predicts who will buy with 95.4% accuracy |
| 2 | `Users` | Customer Segmentation | Auto-segment into High/Medium/Low value groups |
| 3 | `MessageSquare` | AI Marketing Chatbot | Ask your data like ChatGPT - get strategies instantly |
| 4 | `BarChart3` | Analytics Dashboard | Visualize trends and track prediction performance |

#### Design
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Each feature in a shadcn `Card`
- Icon in colored circle (blue bg for icons)
- Title: `text-xl font-semibold`
- Description: `text-muted-foreground`

---

### 6. Chatbot Section (`ChatbotSection.tsx`) - DIFFERENTIATOR

#### Layout (2-column on desktop)
**Left Column: Explanation**
```
"Ask your data like ChatGPT"

Get instant marketing insights:
- Why are conversions low?
- Which users should I target?
- What strategy should I use?

Our AI analyzes your prediction data and provides:
1. Insight (data-driven observation)
2. Explanation (clear reasoning)
3. Strategy (actionable marketing plan)
4. Recommendation (next steps)
```

**Right Column: Mock Chat Interface**
```
┌─────────────────────────────────────┐
│ Q: Which users should I target?     │
│                                     │
│ A: Insight: High-engagement users  │
│    have 2x conversion rate          │
│                                     │
│    Explanation: Social signals...    │
│                                     │
│    Strategy: Target users with...    │
│                                     │
│    Recommendation: Launch campaign.. │
└─────────────────────────────────────┘
```

#### Example Questions to Display
- "Which users should I target?"
- "Why are conversions low?"
- "What strategy should I use for High segment?"
- "How do I improve Medium segment conversion?"

#### Design
- Use existing `ChatMessage.tsx` component or create simplified version
- Style as a "preview" card (not functional)
- Add blinking cursor animation for realism

---

### 7. Social Proof Section (`SocialProof.tsx`)

#### Tech Stack (Built With)
```
Built with:
[XGBoost] [FastAPI] [Spring Boot] [Next.js]
```

- Use simple text badges or icons
- Add performance stats:
  - "Handles up to 1M rows"
  - "95.4% prediction accuracy (ROC-AUC)"
  - "500+ marketers trust us"

#### Design
- Centered text with muted colors
- Small logos/icons (if available) or simple badges
- Stats in a row: `flex justify-center gap-8`

---

### 8. Final CTA Section (`CTASection.tsx`)

#### Copy
```
Headline: "Start predicting your customers today"
Subheadline: "Join 500+ marketers using AI to boost conversions by 27%"
```

#### CTAs
- "Try Demo" (scrolls to demo section)
- "Get Started" (navigates to `/upload`)

#### Design
- Different background color (`bg-muted/50`)
- Large centered text
- Two buttons (same as hero)

---

### 9. Layout & Navigation Changes

#### A. Move Dashboard to `/dashboard`
1. Create `src/app/dashboard/page.tsx`
2. Copy all content from current `src/app/page.tsx` to new file
3. Clear `src/app/page.tsx` and add landing page components
4. Update `Sidebar.tsx` navigation links to point to `/dashboard` instead of `/`

#### B. Simplify Header on Landing Page
**Current Header**: Search bar, notifications, language toggle, user menu
**Landing Header**: Logo, language toggle, "Login" button (if needed)

```typescript
// In Header.tsx, conditionally render:
const pathname = usePathname();
const isLandingPage = pathname === '/';

// Hide search bar on landing page
{!isLandingPage && <SearchBar />}
```

#### C. Hide/Collapse Sidebar on Landing Page
**Option A (Recommended)**: Don't render Sidebar on landing page
```typescript
// In layout.tsx
const pathname = usePathname();
const showSidebar = pathname !== '/';

return (
  <div className="flex min-h-screen">
    {showSidebar && <Sidebar />}
    <div className={showSidebar ? "flex-1 ml-64 mt-16" : "flex-1"}>
      <Header />
      <main>{children}</main>
    </div>
  </div>
);
```

**Option B**: Collapse Sidebar (keep but minimize)

---

### 10. Internationalization (i18n)

#### Add to `src/i18n/translations.ts`
```typescript
landing: {
  hero: {
    headline: "Stop guessing which customers will buy",
    subheadline: "Predict purchase behavior instantly with AI. Increase conversions by 27% using intelligent customer segmentation.",
    tryDemo: "Try Demo",
    uploadData: "Upload Your Data",
    socialProof: "Trusted by 500+ marketers"
  },
  howItWorks: {
    title: "How It Works",
    step1: { title: "Upload Your Data", desc: "Drag & drop your CSV file (10K to 1M rows)" },
    step2: { title: "AI Predicts", desc: "Our model predicts purchase probability" },
    step3: { title: "Get Insights", desc: "Receive AI-powered strategies via chatbot" }
  },
  demo: {
    title: "See It In Action",
    tryDemo: "Try Demo Dataset",
    table: { user_id: "User ID", probability: "Purchase Probability", segment: "Segment" }
  },
  features: {
    title: "Why Choose Our Platform",
    prediction: { title: "Purchase Prediction", desc: "ML model predicts who will buy with 95.4% accuracy" },
    segmentation: { title: "Customer Segmentation", desc: "Auto-segment into High/Medium/Low value groups" },
    chatbot: { title: "AI Marketing Chatbot", desc: "Ask your data like ChatGPT - get strategies instantly" },
    analytics: { title: "Analytics Dashboard", desc: "Visualize trends and track prediction performance" }
  },
  chatbot: {
    title: "Ask Your Data Like ChatGPT",
    examples: ["Which users should I target?", "Why are conversions low?", "What strategy should I use?"]
  },
  socialProof: {
    builtWith: "Built with",
    stats: { rows: "Handles up to 1M rows", accuracy: "95.4% prediction accuracy", users: "500+ marketers trust us" }
  },
  cta: {
    headline: "Start predicting your customers today",
    subheadline: "Join 500+ marketers using AI to boost conversions",
    tryDemo: "Try Demo",
    getStarted: "Get Started"
  }
}
```

#### Vietnamese Translations
Add corresponding Vietnamese translations for all keys above.

---

### 11. Responsive Design Checklist

| Component | Mobile (375px) | Tablet (768px) | Desktop (1024px+) |
|-----------|------------------|-------------------|---------------------|
| Hero | Stacked, large text | Side-by-side | Full width with illustration |
| How It Works | 1-col stack | 3-col grid | 3-col with arrows |
| Demo | Table (scroll-x) | Full table | Table + Chart side-by-side |
| Features | 1-col stack | 2-col grid | 2x2 grid |
| Chatbot | Stacked | 2-col | 2-col with chat preview |
| CTA | Centered text | Centered | Large centered |

---

### 12. Success Criteria

1. ✅ User lands on `/` → sees hero in <5 seconds
2. ✅ Headline clearly communicates value ("Stop guessing which customers will buy")
3. ✅ "Try Demo" button scrolls to demo section with mock data visible
4. ✅ "Upload Your Data" button navigates to `/upload`
5. ✅ Demo section shows sample table + pie chart (no upload required)
6. ✅ Chatbot section shows 4-section response format preview
7. ✅ Mobile responsive (tested at 375px width)
8. ✅ Language toggle works (EN/VI) on landing page
9. ✅ No technical jargon in hero ("XGBoost", "Pipeline" should NOT appear in hero)
10. ✅ Dashboard still accessible at `/dashboard` with full functionality

---

### 13. Implementation Order

1. **Phase 1**: Create landing page components (Hero, HowItWorks, Demo, Features, Chatbot, SocialProof, CTA)
2. **Phase 2**: Move dashboard to `/dashboard`
3. **Phase 3**: Update `src/app/page.tsx` with landing page
4. **Phase 4**: Modify Sidebar/Header for landing page
5. **Phase 5**: Add i18n translations
6. **Phase 6**: Test responsive design + CTA behaviors
7. **Phase 7**: Verify dashboard still works at `/dashboard`

---

### 14. Notes & Reminders

- **Do NOT use technical jargon** in marketing copy (hero, features)
- **Do NOT write long paragraphs** - keep it visual and scannable
- **Use existing shadcn/ui components** where possible (Card, Table, Badge, Button)
- **Reuse existing mock data** from `src/lib/mock-data.ts` for demo section
- **Test on mobile** early and often (Chrome DevTools, 375px width)
- **Smooth scroll** for "Try Demo" button (use `scrollIntoView`)
- **Keep it conversion-focused**, not just informational

---

**Status**: Ready for implementation  
**Next Step**: Execute Phase 1 (create landing page components)
