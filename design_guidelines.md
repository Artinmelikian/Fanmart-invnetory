# Stock Management Application - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Linear/Modern SaaS Productivity Tool

**Justification:** This is a utility-focused business application requiring efficiency, clarity, and data-dense displays. Following a modern productivity tool pattern (Linear, Notion, Retool) ensures professional appearance with optimal usability for daily operations.

## Typography

**Font Family:** 
- Primary: Inter or Work Sans (via Google Fonts CDN)
- Monospace: JetBrains Mono (for numerical values, quantities, codes)

**Hierarchy:**
- Page Headers: text-2xl font-semibold
- Section Headers: text-lg font-medium
- Table Headers: text-sm font-medium uppercase tracking-wide
- Body Text: text-base font-normal
- Labels: text-sm font-medium
- Helper Text: text-xs
- Numerical Data: font-mono text-base for consistency in tables

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6
- Section spacing: space-y-8
- Form field gaps: gap-4
- Table cell padding: px-6 py-4
- Button padding: px-4 py-2

**Container Structure:**
- Max width: max-w-7xl mx-auto
- Main content area: px-6 py-8
- Card/Panel padding: p-6

## Core Layout Structure

**Dashboard Layout:**
- Fixed sidebar navigation (w-64) with app logo, main navigation items
- Main content area with breadcrumb trail at top
- Three primary sections accessible from sidebar:
  1. Inventory Overview (default view)
  2. Add New Item
  3. Record Sale

**Inventory Overview Page:**
- Page header with title + "Add New Item" button (right-aligned)
- Search bar with filter/sort controls below header
- Stats cards row (3 columns): Total Items, Total Stock Value, Low Stock Alerts
- Main inventory table (full width)

**Add Item Page:**
- Centered form card (max-w-2xl)
- Two-column layout for form fields (grid-cols-2 on desktop, single column mobile)
- Required fields section clearly separated from optional fields
- Submit button right-aligned at bottom

**Record Sale Page:**
- Centered transaction form (max-w-xl)
- Item selector (searchable dropdown)
- Current stock display (read-only, prominent)
- Quantity input with validation
- Remaining stock preview (calculated in real-time)
- Action buttons: "Record Sale" primary, "Cancel" secondary

## Component Library

**Navigation Sidebar:**
- Fixed left sidebar with subtle border-right
- Logo/brand at top (h-16)
- Navigation items with icon + label, rounded-lg on hover/active
- Active state: subtle background fill

**Data Table:**
- Striped rows for readability (alternate row treatment)
- Sticky header row
- Sortable columns (with sort icons from Heroicons)
- Row hover state with subtle background shift
- Monospace font for numerical columns (Quantity, Flow, Power, Weight, Speed)
- Action column (rightmost) with "Edit" and "Delete" icon buttons

**Table Columns:**
1. Item Name (left-aligned, font-medium)
2. Quantity (right-aligned, monospace, font-semibold)
3. Flow (m³/h) (right-aligned, monospace)
4. Power (W) (right-aligned, monospace, muted if empty)
5. Weight (kg) (right-aligned, monospace, muted if empty)
6. Speed (rpm) (right-aligned, monospace, muted if empty)
7. Actions (center-aligned, icon buttons)

**Forms:**
- Label above input pattern
- Required fields marked with asterisk
- Input fields: border, rounded-lg, px-4 py-2
- Focus state: enhanced border, focus ring
- Validation messages below field (text-sm, error treatment)
- Helper text in muted style below inputs for units (e.g., "in m³/h")
- Number inputs with step controls for quantities

**Stats Cards:**
- Grid of 3 cards (grid-cols-3)
- Each card: border, rounded-lg, p-6
- Large number display (text-3xl font-bold monospace)
- Label below number (text-sm muted)
- Icon in top-right corner (Heroicons)

**Buttons:**
- Primary: px-6 py-2.5, rounded-lg, font-medium
- Secondary: px-6 py-2.5, rounded-lg, border, font-medium
- Icon buttons: p-2, rounded-md
- Disabled state: reduced opacity, cursor-not-allowed

**Search & Filters:**
- Search input: w-full max-w-md with search icon (Heroicons) prefix
- Filter dropdowns: inline next to search
- Sort controls: compact button group

**Modals/Dialogs:**
- Centered overlay with backdrop blur
- Card style: rounded-xl, p-8, max-w-md
- Header: text-xl font-semibold
- Content area with appropriate spacing
- Footer actions: right-aligned button group

**Notifications/Alerts:**
- Toast style: fixed top-right positioning
- Success/Error states with appropriate icons (Heroicons)
- Auto-dismiss after 3 seconds
- Border-left accent for message type

**Empty States:**
- Centered content with icon (Heroicons)
- Message text: text-base
- Call-to-action button below

## Icons
**Library:** Heroicons (via CDN) - outline style for navigation, solid style for alerts/status

## Accessibility
- All form inputs have associated labels
- Focus indicators on all interactive elements
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only buttons
- Table headers use proper scope attributes
- Keyboard navigation throughout

## Images
No images required for this business utility application. Focus on clean data presentation and form functionality.