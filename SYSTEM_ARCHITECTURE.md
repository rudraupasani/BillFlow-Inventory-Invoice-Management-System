# BillFlow - System Architecture & Features

## Overview

BillFlow is a comprehensive SaaS platform for billing and inventory management with a complete POS (Point of Sale) system. It includes role-based access control, multi-user support, and advanced business management features.

---

## Features & Modules

### 1. **Point of Sale (POS) System**
- **Real-time bill creation** with customer selection
- **Product search** by name, SKU, or barcode
- **Cart management** with quantity adjustments
- **Discount support** (percentage or fixed amount)
- **Multiple payment methods**: Cash, Card, UPI, Cheque
- **GST-aware** calculations with itemized tax breakdown
- **Instant bill completion** with database storage

### 2. **Inventory Management**
- **Real-time stock tracking** with low-stock alerts
- **Inventory adjustments** (Purchase, Sale, Return, Manual Set)
- **Reorder level management** to prevent stockouts
- **Stock value calculations** based on cost
- **Barcode support** for quick product identification
- **Movement history** (planned enhancement)

### 3. **Billing & Invoicing**
- **Invoice creation** with line-item detail
- **GST calculation** per item with configurable rates
- **Payment tracking** with multiple methods
- **Invoice status management** (Draft, Sent, Paid, Overdue, Cancelled)
- **Customer-specific invoicing** with history
- **Recurring invoice support** (configurable)

### 4. **Customer Management**
- **Customer database** with full contact information
- **Customer history** tracking
- **Status management** (Active/Inactive)
- **Tax ID support** for GST invoicing
- **Purchase history** (linked via invoices)

### 5. **Product Management**
- **Complete product catalog** with pricing and costs
- **Barcode generation** (EAN-13 compatible)
- **GST rate management** per product
- **HSN/SAC codes** for tax compliance
- **Unit type support** (pieces, kg, liters, etc.)
- **Stock level management** with reorder levels

### 6. **Analytics & Reports**
- **Revenue tracking** with trend analysis
- **Invoice status distribution**
- **Top-performing products**
- **Payment method breakdown**
- **Daily/Monthly/Yearly summaries**
- **Export capabilities** (Excel, PDF planned)

### 7. **Store Settings**
- **Store information** management (Name, GST #, Address)
- **Invoice customization** (prefix, format, footer)
- **Billing preferences** (GST rates, payment methods)
- **System configuration** (Currency, Theme, Features)
- **Barcode settings** (enable/disable, label printing)

### 8. **User Management**
- **Role-based access control** (Owner, Admin, Manager, Staff)
- **User creation and management**
- **Permission enforcement** at module level
- **Activity tracking** (planned enhancement)
- **Staff scheduling** (planned enhancement)

### 9. **Dashboard**
- **Real-time metrics** display
- **Today's sales** summary
- **Quick alerts** for critical issues
- **Inventory status** overview
- **Quick access** to POS and other modules
- **Performance indicators** at a glance

---

## Role-Based Access Control

### Owner
- Full system access
- User management (create, edit, delete)
- Settings control
- All operations on all modules
- Cannot be deleted

### Admin
- Most operations including create, read, update on all modules
- Limited user management (no delete)
- Settings modifications
- Reports and analytics access
- Dashboard and inventory management

### Manager
- Dashboard access (read-only)
- Inventory management
- Invoice creation and updates
- Customer management
- Cannot modify settings or manage users

### Staff
- POS operations (create bills)
- Basic report viewing
- Invoice viewing and limited updates
- Inventory viewing
- Cannot access settings or user management

---

## Technical Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with dark mode
- **UI Components**: shadcn/ui (150+ components)
- **Charts**: Recharts for analytics
- **State Management**: React Context + SWR

### Backend
- **API Routes**: Next.js API Routes (RESTful)
- **Database**: Mock in-memory (ready for Supabase/MongoDB/PostgreSQL migration)
- **Authentication**: Session-based with localStorage
- **Data Validation**: TypeScript interfaces

### Database Schema (Mock Data Structure)

**Users Table**
```
- id: string
- email: string
- name: string
- role: 'owner' | 'admin' | 'manager' | 'staff'
- storeId: string
- isActive: boolean
- createdAt: Date
```

**Products Table**
```
- id: string
- name: string
- sku: string
- barcode: string (optional)
- price: number
- cost: number
- quantity: number
- reorderLevel: number
- gstRate: number (0, 5, 12, 18, 28)
- hsn: string (optional)
- unit: string (optional)
- category: string
- status: 'active' | 'inactive'
- createdAt: Date
- updatedAt: Date
```

**Invoices Table**
```
- id: string
- invoiceNumber: string
- customerId: string
- items: InvoiceItem[]
- subtotal: number
- tax: number
- discount: number
- total: number
- paymentMethod: 'cash' | 'upi' | 'card' | 'cheque' | 'credit'
- status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
- isBill: boolean (true for POS bills)
- issueDate: Date
- dueDate: Date
- createdAt: Date
- updatedAt: Date
```

**Customers Table**
```
- id: string
- name: string
- email: string
- phone: string
- address: string
- city: string
- state: string
- zipCode: string
- country: string
- taxId: string (GST #)
- status: 'active' | 'inactive'
- createdAt: Date
- updatedAt: Date
```

**Store Table**
```
- id: string
- name: string
- gstNumber: string
- address: string
- city: string
- state: string
- zipCode: string
- country: string
- phone: string
- email: string
- logo: string (optional)
- createdAt: Date
- updatedAt: Date
```

**StoreSettings Table**
```
- id: string
- storeId: string
- invoicePrefix: string
- billPrefix: string
- invoiceFormat: 'detailed' | 'simple'
- billFormat: 'thermal' | 'a4'
- enableGST: boolean
- defaultGSTRate: number
- enableCreditNotes: boolean
- enableRecurringInvoices: boolean
- enableBarcode: boolean
- enableBarcodeLabel: boolean
- currencySymbol: string
- currencyCode: string
- theme: 'light' | 'dark'
- createdAt: Date
- updatedAt: Date
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Invoices & Bills
- `GET /api/invoices` - List invoices/bills
- `POST /api/invoices` - Create invoice/bill
- `GET /api/invoices/[id]` - Get invoice details
- `PUT /api/invoices/[id]` - Update invoice status
- `DELETE /api/invoices/[id]` - Delete invoice (draft only)

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Store
- `GET /api/store` - Get store info
- `PUT /api/store` - Update store info
- `GET /api/store/settings` - Get store settings
- `PUT /api/store/settings` - Update settings

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

---

## Key Features

### GST Compliance
- Automatic GST calculation per item
- GST breakup in invoices
- Configurable GST rates (0%, 5%, 12%, 18%, 28%)
- HSN/SAC code support
- GST invoice format support

### Barcode Support
- EAN-13 barcode generation
- Barcode scanning in POS
- Barcode label printing
- Inventory tracking via barcode

### Multi-Currency Support
- Currency symbol customization
- Currency code configuration
- Amount formatting based on locale

### Theme Support
- Light and dark theme options
- Theme preference saving
- Consistent across all modules

### Discount Management
- Percentage-based discounts
- Fixed amount discounts
- Automatic calculation
- Display in bills and invoices

---

## Future Enhancements (Planned)

### Phase 8: Advanced Features
- Stock movement history and analytics
- Supplier management
- Purchase order system
- Stock transfers between locations
- Batch/Serial number tracking

### Phase 9: Payments & Settlements
- Payment gateway integration (Stripe, Razorpay)
- Automated payment reminders
- Payment reconciliation
- Settlement reports

### Phase 10: Advanced Analytics
- Predictive stock analysis
- Sales forecasting
- Customer segmentation
- Revenue analytics dashboard

### Phase 11: Integrations
- Accounting software integration (Tally, QuickBooks)
- Email integration for invoices
- SMS notifications
- WhatsApp integration for bills

### Phase 12: Mobile App
- Mobile POS app
- Offline support
- Cloud sync
- Barcode scanning

---

## Migration to Production Database

To migrate from mock data to a real database (Supabase, MongoDB, PostgreSQL):

1. **Update `/lib/db.ts`** - Replace mock arrays with actual database queries
2. **Update API Routes** - Add proper database calls and error handling
3. **Add Database Schema** - Create tables based on the types defined
4. **Update Authentication** - Implement proper session management
5. **Add Validation** - Server-side input validation
6. **Add Logging** - Request/response logging for debugging

The current mock implementation is fully compatible with standard SQL or NoSQL databases with minimal changes.

---

## Security Considerations

- [ ] Password hashing (bcrypt)
- [ ] Secure session tokens
- [ ] Rate limiting on API endpoints
- [ ] Input validation and sanitization
- [ ] CORS configuration
- [ ] API authentication middleware
- [ ] Audit logging for all operations
- [ ] Data encryption at rest
- [ ] Role-based middleware guards
- [ ] SQL injection prevention

---

## Performance Optimization

- Database query optimization
- Caching strategy (Redis/Memcache)
- Image optimization
- CDN for static assets
- API response compression
- Lazy loading of components
- Code splitting
- Database indexing

---

## Testing

- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing
- Load testing for POS peak hours

---

## Deployment

Recommended platforms:
- **Frontend**: Vercel
- **Database**: Supabase, PlanetScale, or MongoDB Atlas
- **Storage**: Vercel Blob or AWS S3
- **CDN**: Vercel Edge Network

---

For more information, refer to:
- `README.md` - Feature overview
- `QUICKSTART.md` - Setup and getting started guide
- `IMPLEMENTATION.md` - Detailed implementation notes
