# VettCode Design System

> **Enterprise-grade design system inspired by Stripe and Linear**  
> Minimalist, trustworthy, and built for scale.

---

## 📐 Design Philosophy

### Core Principles

1. **Borders over Shadows** - Use 1px solid borders to define containers. Shadows are ambient, soft, and low opacity.
2. **Consistency First** - Every card uses 24px padding. Every button uses 6px border radius.
3. **Trust Through Simplicity** - Clean, minimal interfaces that feel professional and reliable.
4. **Accessibility Built-in** - High contrast ratios, proper focus states, and semantic HTML.

---

## 🎨 Color Palette

### Primary Brand

```javascript
Primary:      #4F46E5  // Deep Indigo - Actions & CTAs
Primary Dark: #4338CA  // Hover states
Primary Light: #6366F1  // Lighter variant
Primary BG:   #EEF2FF  // Backgrounds & focus rings
```

**Why Indigo?** Feels more financial/professional than purple. Conveys trust and stability.

### Neutrals (Slate Scale)

```javascript
Slate 50:  #F8FAFC  // Page background (Soft Slate White)
Slate 100: #F1F5F9  // Dividers (barely-there)
Slate 200: #E2E8F0  // Borders
Slate 300: #CBD5E1  // Disabled states
Slate 400: #94A3B8  // Placeholders
Slate 500: #64748B  // Sub-text/labels
Slate 600: #475569  // Secondary text
Slate 700: #334155  // Body text
Slate 800: #1E293B  // Titles
Slate 900: #0F172A  // Main text (almost black with blue tint)
```

### Semantic Colors (Desaturated & Professional)

**Success (Emerald)**

```javascript
Main: #10B981
BG:   #D1FAE5  // Light background
Text: #065F46  // Dark text on light bg
```

**Error (Rose)**

```javascript
Main: #EF4444
BG:   #FEE2E2  // Light pink (not bright red!)
Text: #991B1B  // Dark red text
```

**Warning (Amber)**

```javascript
Main: #F59E0B
BG:   #FEF3C7
Text: #92400E
```

**Info (Sky Blue)**

```javascript
Main: #3B82F6
BG:   #DBEAFE
Text: #1E40AF
```

---

## 🔤 Typography

### Font Family

```css
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  sans-serif;
```

**Installation:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Type Scale

| Element | Size | Weight | Line Height                | Letter Spacing    |
| ------- | ---- | ------ | -------------------------- | ----------------- |
| H1      | 48px | 700    | 1.2                        | -0.02em (tighter) |
| H2      | 36px | 700    | 1.3                        | -0.01em           |
| H3      | 30px | 600    | 1.3                        | -0.01em           |
| H4      | 24px | 600    | 1.4                        | -0.005em          |
| H5      | 20px | 600    | 1.4                        | 0                 |
| H6      | 16px | 600    | 1.5                        | 0                 |
| Body 1  | 16px | 400    | 1.5 (1.5x for readability) | 0                 |
| Body 2  | 14px | 400    | 1.5                        | 0                 |
| Caption | 12px | 400    | 1.4                        | 0.01em            |
| Button  | 14px | 500    | 1.5                        | 0.01em            |

**Key Rules:**

- Tighten letter-spacing on headings for a modern look
- Use 1.5x line-height for body text to increase readability
- Never use uppercase on buttons (textTransform: 'none')

---

## 📦 Spacing System

**8px Grid System** - All spacing is a multiple of 8px

```javascript
xs:  4px   (0.5 unit)
sm:  8px   (1 unit)
md:  16px  (2 units)
lg:  24px  (3 units) ← Standard card padding
xl:  32px  (4 units)
2xl: 48px  (6 units)
3xl: 64px  (8 units)
4xl: 96px  (12 units)
```

**Consistency Rule:** Every card uses 24px padding. No exceptions.

---

## 🎯 Component Specifications

### Buttons

#### Primary Button (World-Class Style)

```javascript
Background:     #4F46E5 (Indigo)
Text:           #FFFFFF (White)
Border Radius:  6px (slightly rounded)
Padding:        10px 20px
Shadow:         0px 1px 2px rgba(0, 0, 0, 0.05) + inner glow
Transition:     150ms (very fast)

Hover:
  Background:   #4338CA (slightly darker)
  Shadow:       0px 1px 3px rgba(0, 0, 0, 0.08)

Active:
  Transform:    scale(0.98)
```

**Inner Glow (Premium Feel):**

```css
box-shadow:
  0px 1px 2px rgba(0, 0, 0, 0.05),
  inset 0px 1px 0px rgba(255, 255, 255, 0.1);
```

#### Secondary Button

```javascript
Background:     transparent
Text:           #334155
Border:         1px solid #E2E8F0
Border Radius:  6px
Padding:        10px 20px

Hover:
  Background:   #F8FAFC
  Border:       #4F46E5
  Text:         #4F46E5
```

### Input Fields (Trust Factor)

```javascript
Background:     #FFFFFF (pops against #F8FAFC page)
Border:         1px solid #E2E8F0 (thin, not thick!)
Border Radius:  6px
Padding:        12px 14px
Font Size:      14px
Transition:     150ms

Hover:
  Border:       #CBD5E1

Focus:
  Border:       #4F46E5 (1px, not 2px!)
  Shadow:       0 0 0 3px #EEF2FF (indigo halo)
```

**Amateur vs Professional:**

- ❌ Amateur: Thick 2px borders
- ✅ Professional: Thin 1px borders with focus ring

### Cards

```javascript
Background:     #FFFFFF
Border:         1px solid #E2E8F0
Border Radius:  8px
Padding:        24px (consistent!)
Shadow:         0px 1px 3px rgba(0, 0, 0, 0.05) (very subtle)

Hover:
  Border:       #CBD5E1
  Shadow:       0px 4px 6px rgba(0, 0, 0, 0.05)
```

### Status Badges (Refined, Not Bright)

```javascript
Border Radius:  6px
Font Size:      12px
Font Weight:    500
Height:         24px
Padding:        0 8px

Success:
  Background:   #D1FAE5 (light green)
  Text:         #065F46 (dark green)
  Border:       #A7F3D0

Error:
  Background:   #FEE2E2 (light pink, NOT bright red!)
  Text:         #991B1B (dark red)
  Border:       #FECACA

Pending:
  Background:   #FEF3C7 (light amber)
  Text:         #92400E (dark amber)
  Border:       #FDE68A
```

**Key Rule:** Never use bright red boxes. Use light backgrounds with dark text.

---

## 🎭 Shadows (Ambient & Subtle)

```javascript
xs:  0px 1px 2px rgba(0, 0, 0, 0.05)
sm:  0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)
md:  0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.03)
lg:  0px 10px 15px rgba(0, 0, 0, 0.05), 0px 4px 6px rgba(0, 0, 0, 0.03)
xl:  0px 20px 25px rgba(0, 0, 0, 0.05), 0px 10px 10px rgba(0, 0, 0, 0.02)
```

**Philosophy:** Shadows should be wide, soft, and low opacity. They create depth without being obvious.

---

## 🎬 Transitions

```javascript
Fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)  // Buttons, inputs
Base: 200ms cubic-bezier(0.4, 0, 0.2, 1)  // Cards, modals
Slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)  // Drawers, large elements
```

**Rule:** Interactions should feel instant. Use 150ms for most UI elements.

---

## 🔧 Usage

### 1. Apply Theme to Your App

```javascript
// main.jsx or App.jsx
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### 2. Use Design Tokens

```javascript
import { colors, spacing, shadows } from "./theme/tokens";

const MyComponent = styled("div")({
  backgroundColor: colors.cardBackground,
  padding: spacing.lg,
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.sm,
});
```

### 3. Use Pre-styled Components

```javascript
import {
  PageContainer,
  PageTitle,
  StyledCard,
  PrimaryButton,
  StatusBadge,
} from "./theme/components";

function MyPage() {
  return (
    <PageContainer>
      <PageTitle>Dashboard</PageTitle>
      <StyledCard>
        <StatusBadge status="active">Active</StatusBadge>
        <PrimaryButton>Create New</PrimaryButton>
      </StyledCard>
    </PageContainer>
  );
}
```

### 4. Use MUI Components with Theme

```javascript
import { Button, TextField, Card } from "@mui/material";

// All MUI components automatically use the theme
<Button variant="contained" color="primary">
  Click Me
</Button>;
```

---

## ✅ Neatness Checklist

Before shipping any UI, verify:

- [ ] **Consistent Padding** - Every card uses 24px padding
- [ ] **Icon Weight** - All icons use the same stroke weight (1.5pt or 2pt)
- [ ] **Border Thickness** - All borders are 1px, never 2px
- [ ] **Status Colors** - No bright red boxes, use light backgrounds with dark text
- [ ] **Button Radius** - All buttons use 6px border radius
- [ ] **Input Focus** - Focus states have indigo halo, not thick borders
- [ ] **Typography** - Headings use tighter letter-spacing
- [ ] **Shadows** - Shadows are subtle and ambient, not harsh
- [ ] **Transitions** - All interactions use 150ms transitions
- [ ] **Spacing** - All spacing is a multiple of 8px

---

## 🎨 Icon Guidelines

**Recommended Icon Libraries:**

- [Lucide React](https://lucide.dev/) - Clean, consistent, 2pt stroke
- [Heroicons](https://heroicons.com/) - Tailwind's icon set

**Rules:**

- Use 1.5pt or 2pt stroke weight consistently
- Never mix thick and thin icons
- Icon size: 20px for buttons, 24px for standalone

---

## 📱 Responsive Breakpoints

```javascript
xs: 0px      // Mobile
sm: 600px    // Tablet
md: 900px    // Small laptop
lg: 1200px   // Desktop
xl: 1536px   // Large desktop
```

---

## 🚀 Quick Start Examples

### Example 1: Dashboard Card

```javascript
import {
  StyledCard,
  SectionTitle,
  FlexRow,
  StatusBadge,
} from "./theme/components";

<StyledCard>
  <FlexRow>
    <SectionTitle>Recent Orders</SectionTitle>
    <StatusBadge status="active">5 New</StatusBadge>
  </FlexRow>
  {/* Card content */}
</StyledCard>;
```

### Example 2: Form with Validation

```javascript
import { StyledInput, PrimaryButton, ErrorAlert } from "./theme/components";

<form>
  <StyledInput label="Email" placeholder="you@example.com" fullWidth />
  <ErrorAlert severity="error">Please enter a valid email address</ErrorAlert>
  <PrimaryButton type="submit">Submit</PrimaryButton>
</form>;
```

### Example 3: Stat Cards

```javascript
import { GridContainer, StatCard } from "./theme/components";
import { TrendingUp } from "@mui/icons-material";

<GridContainer>
  <StatCard>
    <TrendingUp color="primary" />
    <h3>$12,345</h3>
    <p>Total Revenue</p>
  </StatCard>
  {/* More stat cards */}
</GridContainer>;
```

---

## 🎯 Design System Goals

1. **Speed** - Developers can build UIs 3x faster with pre-styled components
2. **Consistency** - Every screen looks cohesive and professional
3. **Trust** - Users feel confident using the platform
4. **Scale** - Easy to maintain and extend as the product grows

---

## 📚 Resources

- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Lucide Icons](https://lucide.dev/)
- [Material-UI Docs](https://mui.com/)
- [Stripe Design](https://stripe.com/design)
- [Linear Design](https://linear.app/method)

---

## 🤝 Contributing

When adding new components:

1. Follow the existing patterns
2. Use design tokens, not hardcoded values
3. Add documentation with examples
4. Test on mobile and desktop
5. Verify accessibility (contrast, focus states)

---

**Built with ❤️ for VettCode**
