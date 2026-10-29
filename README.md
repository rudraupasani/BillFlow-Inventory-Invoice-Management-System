# BillFlow - SaaS Billing & Inventory Management System

A modern, production-ready SaaS application for managing invoices, customers, products, and inventory. Built with Next.js 16, TypeScript, and Tailwind CSS with a beautiful dark theme.

## Features

### MVP Phase (Current)
- **Authentication System** - Secure login with session management
- **Dashboard** - Real-time business metrics and key indicators
- **Customer Management** - Create, read, update, and delete customers
- **Product Management** - Manage products with pricing and inventory tracking
- **Invoice Management** - Create and manage invoices with line items
- **Reports & Analytics** - Visual charts showing revenue trends and invoice status

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Mock in-memory database (easily migratable to Supabase, MongoDB, etc.)
- **Authentication**: Session-based auth with HTTP-only cookies
- **UI Components**: Custom built on shadcn/ui with dark mode support

## Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login
- **Email**: demo@example.com (or any email)
- **Password**: any password
- Demo mode accepts any credentials for testing

## Project Structure

```
/app
  /dashboard          # Protected dashboard pages
    /invoices         # Invoice management
    /customers        # Customer management
    /products         # Product management
    /reports          # Analytics and reports
  /api                # API routes
    /auth             # Authentication endpoints
    /customers        # Customer API
    /products         # Product API
    /invoices         # Invoice API
    /dashboard        # Dashboard metrics API
  
/components
  /ui                 # shadcn/ui components
  sidebar.tsx         # Navigation sidebar
  stat-card.tsx       # Reusable stat card
  form-field.tsx      # Form field wrapper
  
/lib
  db.ts              # Mock database layer
  types.ts           # TypeScript interfaces
  auth-context.tsx   # Authentication context
```

## Key Components

### Dashboard
- Real-time metrics showing total revenue, invoices, products, and customers
- Quick alerts for unpaid invoices and low stock products
- Payment status summary

### Invoices
- Create, view, and manage invoices
- Automatic calculations for subtotals, tax, and totals
- Invoice status tracking (draft, sent, paid, overdue, cancelled)
- Detailed invoice view with customer information and line items

### Customers
- Full CRUD operations for customer management
- Store customer details (address, phone, tax ID, etc.)
- Track customer status (active/inactive)

### Products
- Product catalog with pricing and cost tracking
- Inventory management with stock level alerts
- Product categorization and SKU tracking
- Stock status indicators (in stock, low stock, out of stock)

### Reports
- Revenue trend visualization over months
- Invoice status distribution
- Key metrics summary (total revenue, average invoice, pending payments)

## Database Layer

The application uses a mock in-memory database that's easily migratable to any backend:

```typescript
// lib/db.ts contains all database operations
// Simple to migrate to Supabase, MongoDB, PostgreSQL, etc.

db.getCustomers()           // Fetch all customers
db.createCustomer(data)     // Create new customer
db.updateCustomer(id, data) // Update customer
db.deleteCustomer(id)       // Delete customer

// Same pattern for products and invoices
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

## Styling

The application uses a modern dark theme with:
- **Primary Color**: Deep blue (oklch(0.6 0.22 265))
- **Background**: Near black (oklch(0.08 0 0)) in dark mode
- **Cards**: Dark navy (oklch(0.12 0 0)) in dark mode
- **Accent**: Bright blue for interactive elements

All colors are defined using CSS custom properties in `globals.css` for easy theming.

## Development

### Adding New Features
1. Create database operations in `/lib/db.ts`
2. Create API route in `/app/api/[feature]/route.ts`
3. Create UI components in `/components/[feature].tsx`
4. Create page in `/app/dashboard/[feature]/page.tsx`

### Using Components
```tsx
import { StatCard } from '@/components/stat-card'
import { FormField } from '@/components/form-field'

<StatCard 
  title="Revenue" 
  value="$12,345" 
  description="Last 30 days"
  icon={DollarSign}
/>
```

## Future Enhancements (Phase 2)

- Advanced inventory management with stock alerts
- Recurring invoices
- Payment processing integration
- Team collaboration features
- Advanced reports with custom date ranges
- Email notifications
- Multi-currency support
- Integration with accounting software
- Mobile app

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy from Vercel dashboard
```

### Self-Hosted
```bash
pnpm build
pnpm start
```

## Performance Optimizations

- Server-side rendering for faster initial load
- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind for minimal bundle size
- Component-level code splitting
- Optimized database queries

## Security

- HTTP-only cookies for session storage
- CSRF protection with Next.js
- Input validation and sanitization
- TypeScript for type safety
- Environment variables for sensitive data

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on the project repository.

---

Built with ❤️ using Next.js and modern web technologies.
