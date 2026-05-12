# VettCode Design System - Quick Start Guide

## 🚀 Getting Started

The VettCode Design System is now fully integrated into your application. All MUI components automatically use the professional theme.

### Installation Complete ✅

The theme is already applied in `src/main.jsx`. No additional setup needed!

---

## 📁 File Structure

```
src/theme/
├── index.js          # Main theme configuration (MUI theme)
├── tokens.js         # Design tokens (colors, spacing, etc.)
├── components.jsx    # Pre-styled reusable components
├── examples.jsx      # Usage examples
└── README.md         # Comprehensive documentation
```

---

## 🎨 Quick Reference

### Colors

```javascript
import { colors } from "./theme/tokens";

// Primary
colors.primary; // #4F46E5 (Deep Indigo)
colors.primaryDark; // #4338CA (Hover)
colors.primaryBg; // #EEF2FF (Backgrounds)

// Neutrals
colors.slate50; // #F8FAFC (Page background)
colors.slate200; // #E2E8F0 (Borders)
colors.slate500; // #64748B (Sub-text)
colors.slate900; // #0F172A (Main text)

// Semantic
colors.success; // #10B981
colors.error; // #EF4444
colors.warning; // #F59E0B
colors.info; // #3B82F6
```

### Spacing (8px Grid)

```javascript
import { spacing } from "./theme/tokens";

spacing.xs; // 4px
spacing.sm; // 8px
spacing.md; // 16px
spacing.lg; // 24px  ← Standard card padding
spacing.xl; // 32px
spacing["2xl"]; // 48px
```

---

## 💡 Usage Examples

### 1. Using MUI Components (Automatic Theming)

```javascript
import { Button, TextField, Card } from '@mui/material'

// All MUI components automatically use the theme
<Button variant="contained" color="primary">
  Click Me
</Button>

<TextField
  label="Email"
  placeholder="you@example.com"
  fullWidth
/>

<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### 2. Using Pre-styled Components

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

### 3. Using Design Tokens

```javascript
import { styled } from "@mui/material/styles";
import { colors, spacing, shadows } from "./theme/tokens";

const CustomBox = styled("div")({
  backgroundColor: colors.cardBackground,
  padding: spacing.lg,
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.sm,
});
```

---

## 🎯 Common Patterns

### Dashboard Stats Card

```javascript
import { StatCard, FlexRow, StatusBadge, Spacer } from "./theme/components";
import { TrendingUp } from "@mui/icons-material";

<StatCard>
  <FlexRow>
    <TrendingUp sx={{ color: "#10B981", fontSize: 32 }} />
    <Spacer />
    <StatusBadge status="active">+12%</StatusBadge>
  </FlexRow>
  <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: "8px 0" }}>
    $45,231
  </h3>
  <p style={{ color: "#64748B", fontSize: "0.875rem", margin: 0 }}>
    Total Revenue
  </p>
</StatCard>;
```

### Form with Validation

```javascript
import { StyledInput, PrimaryButton, Label, HelperText } from './theme/components'

<div>
  <Label htmlFor="email">Email Address *</Label>
  <StyledInput
    id="email"
    type="email"
    placeholder="you@example.com"
    fullWidth
  />
  <HelperText>We'll never share your email</HelperText>
</div>
<PrimaryButton type="submit">Submit</PrimaryButton>
```

### Data Table

```javascript
import { StyledCard, SearchInput, StatusBadge } from "./theme/components";
import { Search } from "@mui/icons-material";

<StyledCard>
  <SearchInput
    placeholder="Search..."
    InputProps={{
      startAdornment: <Search sx={{ color: "#94A3B8", mr: 1 }} />,
    }}
  />

  <table style={{ width: "100%", marginTop: "16px" }}>
    <thead>
      <tr style={{ backgroundColor: "#F8FAFC" }}>
        <th
          style={{
            padding: "12px",
            textAlign: "left",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
          }}
        >
          Name
        </th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: "16px", fontSize: "0.875rem", color: "#334155" }}>
          Item Name
        </td>
        <td style={{ padding: "16px" }}>
          <StatusBadge status="active">Active</StatusBadge>
        </td>
      </tr>
    </tbody>
  </table>
</StyledCard>;
```

---

## 🎨 Status Badge Colors

```javascript
<StatusBadge status="active">Active</StatusBadge>    // Green
<StatusBadge status="pending">Pending</StatusBadge>  // Amber
<StatusBadge status="inactive">Inactive</StatusBadge> // Gray
<StatusBadge status="error">Error</StatusBadge>      // Red
<StatusBadge status="draft">Draft</StatusBadge>      // Blue
```

---

## 🔧 Customization

### Override Theme Colors

```javascript
// src/theme/index.js
const colors = {
  primary: {
    main: "#YOUR_COLOR", // Change primary color
  },
};
```

### Add Custom Components

```javascript
// src/theme/components.jsx
export const MyCustomCard = styled(Card)({
  backgroundColor: colors.cardBackground,
  padding: spacing.lg,
  // Your custom styles
});
```

---

## ✅ Design Checklist

Before shipping any UI:

- [ ] All cards use 24px padding
- [ ] All borders are 1px (not 2px)
- [ ] Status badges use light backgrounds with dark text
- [ ] Buttons use 6px border radius
- [ ] Input focus states have indigo halo
- [ ] All spacing is a multiple of 8px
- [ ] Icons use consistent stroke weight
- [ ] Transitions are 150ms

---

## 📚 Full Documentation

See `src/theme/README.md` for:

- Complete color palette
- Typography system
- Component specifications
- Shadow system
- Best practices
- More examples

---

## 🎓 Learn by Example

Check out `src/theme/examples.jsx` for complete page examples:

- Dashboard with stats
- Data table with filters
- Form with validation
- Empty states
- Settings page

---

## 🆘 Need Help?

1. Check `src/theme/README.md` for detailed documentation
2. Look at `src/theme/examples.jsx` for usage patterns
3. Use `src/theme/tokens.js` for design values
4. Import pre-styled components from `src/theme/components.jsx`

---

**Built with ❤️ for VettCode**
