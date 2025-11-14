# Design Guidelines: Multi-Tenant Dashboard Application

## Design Approach
**Selected System:** Modern SaaS Dashboard Pattern inspired by Linear, Vercel Dashboard, and Stripe Dashboard
**Rationale:** Enterprise-grade dashboard requiring clarity, efficiency, and scalability across multiple tenants. Focus on data density, quick comprehension, and professional polish.

## Core Design Principles
1. **Information Clarity:** Dashboard-first design prioritizing data visualization and quick insights
2. **Tenant Identity:** Subtle tenant branding without compromising usability
3. **Scan-ability:** Clear visual hierarchy enabling rapid information processing
4. **Responsive Data:** Charts and tables that adapt gracefully across devices

---

## Typography System

**Primary Font:** Inter (Google Fonts)
**Monospace Font:** JetBrains Mono (for data, metrics, API keys)

**Hierarchy:**
- Dashboard Titles: text-2xl font-semibold (32px)
- Section Headers: text-lg font-medium (18px)
- Card Titles: text-base font-medium (16px)
- Body Text: text-sm (14px)
- Metrics/Numbers: text-3xl font-bold for key KPIs, text-xl for secondary metrics
- Labels/Captions: text-xs uppercase tracking-wide (12px)
- Monospace Data: font-mono text-sm for API endpoints, timestamps, IDs

---

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card spacing: p-6
- Grid gaps: gap-4 to gap-6

**Grid Structure:**
- Dashboard Layout: Two-tier navigation (top bar + sidebar)
- Main Content: max-w-7xl mx-auto with px-6
- Chart Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Responsive breakpoints: Mobile-first, stacking to multi-column

---

## Component Library

### Navigation Architecture

**Top Bar (h-16):**
- Tenant selector dropdown (left)
- Global search bar (center, max-w-xl)
- User profile + notifications (right)
- Fixed position with subtle border-bottom

**Sidebar (w-64):**
- Collapsible on mobile
- Main navigation sections with icons
- Active state with subtle background treatment
- Dashboard, Analytics, API Connections, Settings, Integrations sections

### Dashboard Components

**Metric Cards:**
- Compact stat displays: 3-4 column grid
- Large number (text-3xl font-bold) + label + trend indicator
- Minimal padding (p-6), clean borders
- Optional sparkline chart (small Recharts line)

**Chart Containers:**
- Full-width or 2-column grid based on data complexity
- Card wrapper: rounded-lg border with p-6
- Chart title (text-lg font-medium) + time range selector (right)
- Recharts implementations: Line, Bar, Area, Pie charts
- Chart height: h-80 for primary charts, h-64 for secondary
- Responsive: Full-width on mobile, multi-column on desktop

**Data Tables:**
- Striped rows with hover states
- Sticky headers on scroll
- Column sorting indicators
- Pagination controls (bottom)
- Action buttons (right column, icon-only on mobile)
- Monospace for IDs, timestamps, API keys

**API Connection Cards:**
- Grid layout showing connected services
- Service logo/icon + name + status indicator
- Connection metrics (requests, latency)
- Quick action buttons (Configure, Test, Disconnect)
- "Add New Connection" card with prominent CTA

### Form Elements

**Input Fields:**
- Consistent height (h-10)
- Rounded corners (rounded-md)
- Clear labels above inputs (text-sm font-medium mb-2)
- Placeholder text with appropriate hints
- Error states with text-sm text-red-600 below field

**Dropdowns & Selects:**
- Match input height (h-10)
- Chevron icon indicator
- Searchable for long lists (tenant selector)

**Buttons:**
- Primary: px-4 py-2 rounded-md font-medium
- Secondary: Similar sizing with border treatment
- Icon buttons: w-10 h-10 rounded-md (square)
- Loading states with spinner

### Overlays & Modals

**Modal Structure:**
- Centered overlay with max-w-lg to max-w-2xl
- Header with title + close button
- Body with p-6
- Footer with action buttons (right-aligned)

**Toast Notifications:**
- Top-right positioning
- Success/error/info variants
- Auto-dismiss with progress bar
- Icon + message + optional action

**Dropdown Menus:**
- Subtle shadow and border
- Keyboard navigation support
- Dividers between logical groups

---

## Dashboard-Specific Patterns

**Multi-Tenant Features:**
- Tenant switcher: Prominent dropdown in top bar with search
- Tenant-specific branding area (small logo placement in sidebar)
- Isolated data views with clear tenant context indicator

**API Management:**
- Connection status badges (Connected, Error, Pending)
- API key management with copy-to-clipboard
- Request/response logs in expandable panels
- Rate limit indicators with progress bars

**Customizable Dashboards:**
- Drag-and-drop grid layout for widgets (future consideration)
- Widget library sidebar for adding charts
- Save/reset dashboard layout controls
- Multiple dashboard views per tenant

---

## Responsive Behavior

**Mobile (< 768px):**
- Hamburger menu for sidebar
- Single-column layout for all charts
- Compact metric cards (2-column grid)
- Simplified table views with expandable rows
- Bottom navigation bar for key actions

**Tablet (768px - 1024px):**
- 2-column chart layouts
- Persistent sidebar (collapsible)
- Full data tables with horizontal scroll

**Desktop (> 1024px):**
- 3-column layouts where appropriate
- Side-by-side comparisons
- Expanded data density

---

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation throughout dashboard
- Focus indicators on all focusable elements
- Screen reader announcements for data updates
- High contrast ratios for text and chart elements
- Alt text for chart visualizations (data table alternative)

---

## Performance Considerations

- Lazy load charts below fold
- Virtualized tables for large datasets
- Debounced search inputs
- Optimized Recharts renders with memoization
- Loading skeletons matching component structure

This design system creates a professional, scalable dashboard optimized for data visualization and multi-tenant management while maintaining clarity and usability across devices.