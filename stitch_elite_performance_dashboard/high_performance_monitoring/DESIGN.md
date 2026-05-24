---
name: High-Performance Monitoring
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#aed500'
  on-tertiary: '#293500'
  tertiary-container: '#000000'
  on-tertiary-container: '#667e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#c7f300'
  tertiary-fixed-dim: '#aed500'
  on-tertiary-fixed: '#171e00'
  on-tertiary-fixed-variant: '#3d4d00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  volt-accent: '#D1FF00'
  electric-blue: '#007AFF'
  signal-red: '#FF3B30'
  graphite-gray: '#1C1C1E'
  frost-white: '#F5F5F7'
typography:
  display-lg:
    fontFamily: metropolis
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: metropolis
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: metropolis
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-base:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  data-mono:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: -0.01em
  label-caps:
    fontFamily: metropolis
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-desktop: 40px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

The design system is a fusion of precision engineering and athletic intensity. It targets technical operators and executive stakeholders who require high-density data visualization without sacrificing premium aesthetics. 

The visual language balances **Apple’s refined minimalism**—characterized by expansive whitespace, subtle translucency, and typographic clarity—with **Adidas’s performance-driven grit**, utilizing bold weight contrasts, rigid structural grids, and high-visibility accents. The resulting style is **Corporate-Athletic**: it feels fast, reliable, and authoritative.

Key principles include:
- **High-Stakes Clarity:** Every pixel serves the data.
- **Kinetic Energy:** Use of vertical lines and condensed weights to suggest forward momentum.
- **Premium Industrialism:** A dark-mode first approach using "Ink" and "Volt" to signal urgency and precision.

## Colors

The palette is anchored in a **High-Contrast Dark** scheme. The primary background is a deep, obsidian black (#000000) to allow data visualizations to pop with maximum luminescence. 

- **Primary & Secondary:** Pure Black and Pure White provide the highest possible contrast for text and structural borders.
- **The "Volt" Accent:** A high-visibility neon yellow-green (#D1FF00) is used exclusively for active states, critical alerts, and primary "Live" indicators.
- **Neutral Layers:** We utilize Apple’s "System Gray" scale to create depth, using #1C1C1E for containers and #F5F5F7 for secondary text in light-mode contexts.
- **Semantic Colors:** Blue is reserved for system info, while Red is strictly for terminal failures or critical thresholds.

## Typography

The typography system uses a tri-font approach to differentiate between branding, interface, and data.

1.  **Metropolis (Headlines):** A geometric sans-serif that provides the "Apple" premium feel but used in extra-bold weights to capture "Adidas" energy. Used for section headers and major KPIs.
2.  **Inter (UI/Body):** Chosen for its exceptional legibility in SaaS environments. It handles the majority of the interface's functional text.
3.  **JetBrains Mono (Data):** Used for timestamps, coordinates, and raw metrics. This monospaced font ensures that changing numbers don't cause layout jitter, maintaining a "technical instrument" feel.

**Hierarchy Note:** Use all-caps labels with wide tracking for non-interactive metadata to create an industrial, high-performance look.

## Layout & Spacing

The layout utilizes a **Strict 12-Column Grid** with a hybrid behavior:
- **Desktop:** Fixed maximum width of 1440px for content, centered, with generous 40px outer margins to evoke luxury.
- **Data Density:** Gutters are kept tight (16px) to maximize the amount of information visible on a single screen without scrolling.
- **Modular Blocks:** Content is organized into "Cells." Each cell should span 3, 4, 6, or 12 columns. 

Spacing follows an 8px base unit. Vertical rhythm is enforced through 32px or 48px gaps between major sections, while internal component spacing uses 8px and 12px increments.

## Elevation & Depth

This design system avoids traditional heavy shadows in favor of **Tonal Layering** and **Glassmorphism**.

- **Level 0 (Floor):** Pure Black (#000000).
- **Level 1 (Panels):** Deep Gray (#1C1C1E) with a subtle 1px "Inner Stroke" (White at 10% opacity) to define edges.
- **Level 2 (Overlays/Modals):** Glassmorphism effect. Use a background blur of 20px and a 60% opaque fill of #1C1C1E. 
- **The "Adidas Shadow":** For high-priority cards, use a sharp, 0-blur offset shadow (e.g., 4px 4px 0px) in a dark neutral, creating a brutalist, structured depth rather than a soft, organic one.

## Shapes

The shape language is "Soft-Industrial." 
- **Primary Elements:** Buttons and Input fields use a 4px (Soft) radius. This provides a professional, "tool-like" appearance that is more aggressive than Apple's standard roundness but less harsh than pure 90-degree angles.
- **KPI Cards:** Larger containers may use the `rounded-lg` (8px) setting to create a clear container-to-content relationship.
- **Interactive States:** On hover, elements should not become "rounder"; instead, they should trigger a weight change in the border or a color shift to the Volt accent.

## Components

### Buttons
- **Primary:** High-visibility Volt (#D1FF00) background with Black (#000000) text. Sharp 4px corners. No gradients.
- **Secondary:** Ghost style. 1px White border (30% opacity) with White text. Blurs the background on hover.

### Monitoring Cards
- Use a 1px solid border (#FFFFFF at 10% opacity).
- Headers within cards should use the `label-caps` typography style.
- Include a "Live" indicator in the top-right corner using a pulsing Volt dot.

### Input Fields
- Dark background (#000000), 1px border.
- Focus state: Border color changes to Volt with a 0px blur spread (sharp glow).

### Data Tables
- Row hover state: Background color shifts to #1C1C1E.
- Header row: Sticky, with a glassmorphic blur to show content passing underneath.
- Column dividers: None. Use whitespace and aligned monospaced text to create columns.

### Status Chips
- Small, rectangular (2px radius).
- High-saturation fills for "CRITICAL" (Red) and "STABLE" (Volt). Text is always black or white for contrast.