# Stock Management Application

## Overview

This is a stock management application built for tracking inventory items with technical specifications. The application allows users to view inventory, add new items, edit existing items, record sales, and manually reorder items via drag-and-drop. It's designed as a utility-focused business tool with a modern, productivity-oriented interface following design patterns similar to Linear and Notion.

The system tracks items with attributes including name, quantity, flow rate, power, weight, and speed - suggesting it's specialized for industrial equipment or pumps inventory management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (alternative to React Router)

**UI Component System:**
- shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- "New York" style variant from shadcn/ui
- Custom theme system supporting light/dark modes with CSS variables

**State Management:**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod for form state and validation
- Local React state for UI interactions

**Design System:**
- Typography: Inter for UI text, JetBrains Mono for numerical/code displays
- Spacing: Tailwind's spacing scale (2, 4, 6, 8, 12, 16)
- Modern SaaS productivity tool aesthetic with flat colors and subtle shadows
- Fixed sidebar navigation with main content area
- Responsive layout with mobile considerations

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript running on Node.js
- RESTful API design pattern
- Module resolution using ESM (ES Modules)

**API Structure:**
- `/api/items` - GET all items (ordered by displayOrder), POST new item
- `/api/items/:id` - GET single item, PATCH update item, DELETE item
- `/api/items/reorder` - POST to reorder items (updates displayOrder for all items)
- `/api/sales` - GET all sales history (ordered by date DESC), POST to record sale (atomic transaction)
- `/api/sales/:id/return` - POST to return a sold item back to inventory (atomic transaction)

**Request/Response Handling:**
- JSON request/response format
- Zod schema validation for incoming data
- Error handling with appropriate HTTP status codes
- Request logging middleware for API endpoints

**Code Organization:**
- Separation of concerns: routes, storage layer, database connection
- Storage abstraction layer (IStorage interface) for potential database swapping
- Shared schema definitions between client and server

### Data Storage

**Database:**
- PostgreSQL as the primary database
- Neon serverless PostgreSQL for cloud hosting
- WebSocket connections for serverless compatibility

**ORM & Migrations:**
- Drizzle ORM for type-safe database queries
- Drizzle Kit for schema migrations
- Schema-first approach with TypeScript type inference

**Data Models:**
- **items** table: 
  - id (serial primary key)
  - name (text, required)
  - quantity (integer, required)
  - flow (real, required) - Flow rate in m³/h
  - description (text, optional)
  - power (real, optional) - Power in W
  - weight (real, optional) - Weight in kg
  - speed (real, optional) - Speed in rpm
  - displayOrder (integer, required, default 0) - Custom ordering position
- **sales** table:
  - id (serial primary key)
  - itemId (integer, required) - references items table
  - itemName (text, required) - item name at time of sale
  - quantitySold (integer, required) - quantity sold in this transaction
  - flow (real, required) - item flow at time of sale
  - description (text, optional)
  - power (real, optional) - item power at time of sale
  - weight (real, optional) - item weight at time of sale
  - speed (real, optional) - item speed at time of sale
  - saleDate (timestamp, required, auto-generated) - when sale was recorded
- **users** table: id (uuid), username, password (not currently implemented)

**Schema Validation:**
- Drizzle-Zod integration for automatic schema-to-validator conversion
- Shared validation schemas between client and server via `@shared` alias
- Numeric fields use `real` type for compatibility with frontend number inputs

### External Dependencies

**Database Service:**
- Neon Serverless PostgreSQL (DATABASE_URL environment variable required)
- Connection pooling via @neondatabase/serverless
- WebSocket support for serverless environments

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- Full suite including dialogs, dropdowns, tooltips, forms, etc.
- @dnd-kit (core, sortable, utilities) for drag-and-drop reordering

**Development Tools:**
- Replit-specific plugins for development environment
- Runtime error overlay and cartographer for Replit IDE integration
- TSX for running TypeScript directly in development

**Fonts:**
- Google Fonts CDN for Inter and JetBrains Mono
- Preconnect optimization for faster font loading

**Validation & Forms:**
- Zod for runtime type validation
- React Hook Form for performant form handling
- @hookform/resolvers for Zod integration

**Utilities:**
- date-fns for date manipulation
- clsx and tailwind-merge (via cn utility) for conditional className handling
- class-variance-authority for component variant management

**Build Dependencies:**
- esbuild for server bundling in production
- PostCSS with Tailwind CSS and Autoprefixer
- Vite plugins for React and development tooling

## Features

### Inventory Management
- **View Inventory**: Browse all items in a table with technical specifications
- **Add New Items**: Create new inventory items with required and optional fields
- **Edit Items**: Modify existing item details
- **Delete Items**: Remove items from inventory with confirmation dialog
- **Record Sales**: Track sales and automatically update available quantities with overselling prevention

### Drag-and-Drop Reordering
- **Manual Ordering**: Drag items to reorder them in the table using the grip handle
- **Persistent Order**: Custom order is saved to the database and persists across sessions
- **Smart Filtering**: Drag-and-drop is automatically disabled when search filtering is active to prevent ordering corruption
- Items are ordered by custom displayOrder field, falling back to ID for ties
- Visual feedback during drag with opacity change

### Sold Items History
- **Sales Tracking**: Complete history of all sold items with sale dates
- **Historical Data**: Preserves item details (name, flow, power, weight, speed) at time of sale
- **Date Formatting**: Sales displayed with formatted dates (MMM dd, yyyy HH:mm) using date-fns
- **Sorted Display**: Sales ordered by date descending (newest first)
- **Empty State**: Shows helpful message when no sales have been recorded
- **Atomic Transactions**: Sale recording uses database transactions for data integrity
- **Concurrent Safety**: Atomic UPDATE operations prevent overselling and race conditions
- **Return Capability**: Each sale has a Return button to restore items back to inventory
- **Confirmation Dialog**: Returns require user confirmation before processing
- **Data Protection**: Returns use atomic transactions and verify item exists before deleting sale record
- **Error Handling**: Clear error messages if associated item was deleted from inventory

### Technical Implementation Notes
- Drag-and-drop uses @dnd-kit library for accessible, keyboard-friendly interactions
- Reordering sends the complete item list to backend to maintain consistency
- Search filtering temporarily disables reordering and hides drag handles
- Backend uses sequential displayOrder updates via POST /api/items/reorder endpoint
- Sale recording uses `db.transaction()` with atomic `UPDATE ... WHERE quantity >= ?` to prevent concurrent overselling
- Sale returns use `db.transaction()` with UPDATE verification to prevent data loss if item was deleted
- Sales history preserves item details at time of sale for accurate historical records
- Navigation includes "Sold Items" link in sidebar with Receipt icon
- Error handling improved to parse and display JSON error messages from backend in toast notifications