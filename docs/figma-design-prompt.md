# Figma AI Design Prompt

## Prompt

Design a dark-themed 911 Agency Performance Dashboard for emergency response supervisors. Command center aesthetic — dark backgrounds (#0a0a0f or similar), with accent colors for data visualization. Professional, data-dense, but not cluttered.

### Layout

- **Top bar**: Agency name "Metro 911 Command Center", current date/time, user avatar, and an "Edit Dashboard" toggle button
- **Grid**: 4-column responsive grid below the top bar. Widgets snap to columns. Gap between widgets ~16px.
- **Edit mode indicator**: When "Edit Dashboard" is active, each widget gets a subtle dashed border and a small gear icon in the corner. Clicking gear shows inline size options (Minimal / Normal / Large) as a pill toggle.

### Color System

- Background: very dark navy/charcoal (#0a0a0f, #111118)
- Card surfaces: slightly lighter (#1a1a24, #1e1e2e)
- Card borders: subtle (#2a2a3a)
- Primary accent: blue (#3b82f6)
- Severity colors:
  - Critical: red (#ef4444)
  - High: orange (#f97316)
  - Medium: yellow (#eab308)
  - Low: green (#22c55e)
- Incident type colors:
  - Medical: blue (#3b82f6)
  - Fire: red/orange (#f97316)
  - Police: purple (#a855f7)
  - Traffic: teal (#14b8a6)
- Text: white (#ffffff) for primary, muted gray (#a1a1aa) for secondary

### Widgets (show all in the design)

**Row 1 — KPI Cards (4 columns, 1 each)**

1. **Avg Response Time** — Large number in MM:SS format (e.g. "11:42"), label above, small trend arrow (up/down) with percentage change
2. **Avg Call Answer Time** — Number in seconds (e.g. "14s"), same style
3. **Total Incidents** — Count (e.g. "100"), same style
4. **Critical Incidents** — Count with red accent, same style

Each KPI card:
- Minimal: just the number, small font, no label
- Normal: number + label + trend arrow
- Large: number + label + trend + sparkline mini chart

**Row 2 — Charts (2 columns each)**

5. **Response Time by Type** — Horizontal bar chart, 4 bars (Medical, Fire, Police, Traffic), each bar uses its type color. Bar labels show MM:SS. Card title "Avg Response Time by Type"
6. **Severity Breakdown** — Donut chart showing incident count by severity (Critical/High/Medium/Low), using severity colors. Center shows total count. Legend on the right.

Each chart:
- Minimal: tiny chart, no labels/legend, just the visual
- Normal: chart + title + labels
- Large: chart + title + labels + summary stats below

**Row 3 — Mixed (1 + 3 columns)**

7. **Recent Incidents Feed** — 1-column card, scrollable vertical list of the 5 most recent incidents. Each entry shows: colored dot for type, timestamp, severity badge, one-line summary truncated. Dark card style.
8. **Incidents Over Time** — 3-column area/line chart showing incident count per month. X-axis: months, Y-axis: count. Optionally stacked by type using type colors.

**Row 4 — Full width (4 columns)**

9. **Incidents Data Table** — Full-width table with columns: Time, Type (with colored dot), Severity (badge with severity color), Response Time, Answer Time, Summary. Alternating row backgrounds. Filter bar above with type filter buttons (All / Medical / Fire / Police / Traffic) styled as pill buttons. Subtle hover state on rows.

Table sizes:
- Minimal: 5 rows, fewer columns (Time, Type, Severity only)
- Normal: 10 rows, all columns
- Large: paginated full table with search, all columns, expandable rows showing full ai_summary

### Edit Mode Detail

Show a second screen or overlay state where "Edit Dashboard" is toggled ON:
- Each widget has a dashed border
- Small gear icon top-right of each widget
- One widget shown with its gear menu open: three pill buttons "Minimal | Normal | Large" with the current size highlighted
- A subtle "Add Widget" button at the bottom of the grid with a + icon
- Drag handle icon (6 dots) in the top-left corner of each widget (for future drag-and-drop, visual only for now)

### Typography

- Font: Inter or system sans-serif
- KPI numbers: bold, 2.5-3rem
- Card titles: medium weight, 0.875rem, muted color
- Table text: 0.8125rem, regular weight

### Additional Details

- Rounded corners on cards (8-12px)
- Subtle box shadow or glow on cards
- No heavy gradients — keep it flat with depth from layered backgrounds
- Responsive: on mobile (1 column), all widgets stack vertically and auto-switch to Minimal size
