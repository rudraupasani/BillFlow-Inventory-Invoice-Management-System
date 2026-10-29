# BillFlow - Complete SaaS Billing & POS System

## Overview

BillFlow is a comprehensive production-ready SaaS platform for business billing, inventory management, and point-of-sale (POS) operations. Built with Next.js, TypeScript, and modern web technologies, it provides a complete solution for managing invoices, customers, products, and staff operations.

## System Architecture

### Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Framework**: shadcn/ui with Tailwind CSS v4
- **Database**: Mock in-memory (designed for easy migration to Supabase/MongoDB/PostgreSQL)
- **Authentication**: Session-based with HTTP-only cookies
- **Charts**: Recharts for analytics and reporting
- **Notifications**: Sonner for toast messages
- **Icons**: Lucide React

### Core Features

#### Phase 1: Foundation & Auth Enhancement
- **Role-Based Access Control (RBAC)**
  - Owner: Full system access
  - Admin: Most operations, limited user management
  - Manager: Dashboard, inventory, invoices, reports
  - Staff: POS operations, limited access
- **User Management**: Create, edit, delete team members
- **Extended Type System**: Support for GST, barcodes, inventory tracking
- **Comprehensive Database Schema**: All types pre-defined and integrated

#### Phase 2: Core POS System
- **Point of Sale Interface**
  - Real-time product search with barcode scanning
  - Quick customer selection (walk-in or regular)
  - Instant bill calculation with automatic GST
  - Discount application (fixed or percentage)
  - Multiple payment methods (Cash, UPI, Card, Cheque)
  - PDF bill generation and printing
- **Bill Management**
  - Complete bill workflow from creation to payment
  - Payment tracking
  - Bill history and archives
  - Walk-in customer support

#### Phase 3: Inventory & Customer History
- **Inventory Management**
  - Real-time stock tracking
  - Low stock alerts and reorder notifications
  - Inventory adjustment (purchase, sale, return, adjustment)
  - Stock movement history
  - Inventory value calculation
- **Customer Management**
  - Comprehensive customer profiles with tax information
  - Purchase history timeline
  - Outstanding balance tracking
  - Total spending analytics
  - Recurring customer tracking

#### Phase 4: Analytics & Advanced Reports
- **Revenue Analytics**
  - Monthly revenue trends
  - Revenue vs expenses comparison
  - Daily revenue tracking
- **Invoice Analytics**
  - Payment status distribution
  - Paid vs unpaid invoice breakdown
  - Overdue invoice tracking
- **Product Reports**
  - Top selling products
  - Stock movement analysis
  - Product performance metrics
- **Export Capabilities**
  - PDF export for reports
  - Excel export for data analysis

#### Phase 5: Settings & Configuration
- **Store Configuration**
  - Store name, address, contact information
  - GST number and tax identification
  - Business details and branding
- **Invoice & Billing Settings**
  - Custom invoice/bill prefixes
  - Invoice format selection (detailed/simple)
  - Bill format (thermal/A4)
  - GST configuration
  - Barcode support settings
- **System Settings**
  - Currency and localization
  - Theme selection (light/dark)
  - Credit notes and recurring invoices
  - Payment method configuration

#### Phase 6: UI Polish & Responsive Design
- **Header Component**
  - Global search functionality
  - Notification center with badge
  - User profile menu
  - Quick settings access
- **Sidebar Navigation**
  - Dashboard
  - Point of Sale (highlighted)
  - Invoices
  - Products
  - Inventory
  - Customers
  - Reports
  - Users
  - Settings
- **Responsive Layout**
  - Mobile-first design
  - Tablet optimization
  - Desktop-ready interface
  - Sticky header for easy navigation

## Database Schema

### Users Table
```
- id: string (primary key)
- email: string (unique)
- name: string
- role: 'owner' | 'admin' | 'manager' | 'staff'
- storeId: string (foreign key)
- isActive: boolean
- lastLogin: Date
- createdAt: Date
```

### Customers Table
```
- id: string (primary key)
- name: string
- email: string
- phone: string (optional)
- address: string (optional)
- city, state, zipCode, country: string (optional)
- taxId: string (optional)
- status: 'active' | 'inactive'
- createdAt, updatedAt: Date
```

### Products Table
```
- id: string (primary key)
- name: string
- description: string (optional)
- sku: string (unique)
- barcode: string (optional, unique)
- price: number
- cost: number (optional)
- quantity: number
- reorderLevel: number
- category: string (optional)
- gstRate: number (0, 5, 12, 18, 28)
- hsn: string (optional - HSN/SAC code)
- unit: string (optional - pieces, kg, liters, etc)
- status: 'active' | 'inactive'
- createdAt, updatedAt: Date
```

### Invoices Table
```
- id: string (primary key)
- invoiceNumber: string (unique)
- customerId: string (foreign key)
- issueDate, dueDate: Date
- items: InvoiceItem[] (array of line items)
- subtotal, tax, discount, total: number
- discountType: 'percentage' | 'fixed'
- paymentMethod: 'cash' | 'upi' | 'card' | 'cheque' | 'credit'
- paymentDate: Date (optional)
- status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
- notes: string (optional)
- isBill: boolean (true for POS bills, false for invoices)
- createdAt, updatedAt: Date
```

### InventoryLog Table
```
- id: string (primary key)
- productId: string (foreign key)
- type: 'purchase' | 'sale' | 'adjustment' | 'return'
- quantity: number
- notes: string (optional)
- createdAt: Date
```

### Store Table
```
- id: string (primary key)
- name: string
- gstNumber: string (optional)
- address, city, state, zipCode, country: string (optional)
- phone, email: string (optional)
- logo: string (optional - URL)
- createdAt, updatedAt: Date
```

### StoreSettings Table
```
- id: string (primary key)
- storeId: string (foreign key)
- invoicePrefix, billPrefix: string
- invoiceFormat: 'detailed' | 'simple'
- billFormat: 'thermal' | 'a4'
- enableGST: boolean
- defaultGSTRate: number
- enableCreditNotes, enableRecurringInvoices: boolean
- currencySymbol: string
- currencyCode: string
- theme: 'light' | 'dark'
- invoiceLogo, invoiceFooter, receiptFooter: string (optional)
- enableBarcode, enableBarcodeLabel: boolean
- createdAt, updatedAt: Date
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `DELETE /api/users/[id]` - Delete user

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer details
- `PUT/PATCH /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT/PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Invoices & Bills
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice/bill
- `GET /api/invoices/[id]` - Get invoice details
- `PUT/PATCH /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics (revenue, invoices, customers, etc)

### Store
- `GET /api/store` - Get store information
- `PATCH /api/store` - Update store information
- `GET /api/store/settings` - Get store settings
- `PATCH /api/store/settings` - Update store settings

## Pages & Routes

### Public Routes
- `/` - Redirect to login/dashboard based on auth
- `/login` - User login page

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard with metrics
- `/dashboard/pos` - Point of Sale interface
- `/dashboard/invoices` - Invoice management
- `/dashboard/invoices/[id]` - Invoice detail and editing
- `/dashboard/products` - Product management
- `/dashboard/products/[id]` - Product detail and editing
- `/dashboard/customers` - Customer management
- `/dashboard/customers/[id]` - Customer detail with purchase history
- `/dashboard/inventory` - Inventory tracking
- `/dashboard/reports` - Analytics and reporting
- `/dashboard/users` - Team member management
- `/dashboard/settings` - Store configuration

## Permission Matrix

### Owner
- Full access to all features
- Can manage users and settings
- Can view all reports and analytics
- Can perform all CRUD operations

### Admin
- Can access most features
- Limited user management (cannot delete)
- Can view all reports
- Cannot change critical settings

### Manager
- Dashboard access with read-only
- Can manage inventory and invoices
- Can process POS transactions
- Cannot change settings or manage users

### Staff
- POS operations (create bills)
- Can view own transactions
- Limited product and invoice access
- Cannot change settings

## Key Components

### Header Component
- Global search with product/customer/invoice search
- Notification center with badge
- User profile dropdown with settings access
- Logout functionality

### Sidebar Component
- Navigation to all major sections
- POS highlighted for quick access
- User info display
- Active route indication

### Dashboard Component
- Key metrics display (revenue, customers, products, invoices)
- Quick alerts (unpaid invoices, low stock)
- Revenue summary
- Performance indicators

### POS Component
- Product search and barcode scanning
- Real-time cart management
- Automatic GST calculation
- Discount application
- Payment method selection
- Bill completion and printing

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Adjustment interface
- Inventory movement history
- Stock value calculation

### Reporting
- Revenue trends (line charts)
- Invoice status distribution (bar charts)
- Top selling products
- Payment method breakdown
- Data export functionality

## Security Features

- **Authentication**: Session-based auth with HTTP-only cookies
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: All inputs validated before processing
- **Error Handling**: Graceful error handling with user-friendly messages
- **Data Protection**: Type-safe operations with TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

### Demo Credentials
- Email: Any email (demo mode)
- Password: Any password (demo mode)
- Default User: demo@example.com

## Future Enhancements

1. **Real Database Integration**
   - Supabase integration (ready for implementation)
   - MongoDB support
   - PostgreSQL support

2. **Advanced Features**
   - Multi-store support
   - Advanced reporting and BI
   - Inventory auto-reorder
   - Customer loyalty programs
   - Multi-currency support

3. **Mobile Applications**
   - React Native mobile app
   - Offline POS capabilities
   - Mobile invoicing

4. **Integrations**
   - Payment gateway integration
   - Email notifications
   - SMS updates
   - Accounting software integration
   - E-commerce platform integration

5. **Performance Optimization**
   - Database indexing strategy
   - Caching layer implementation
   - API response optimization
   - Image optimization

## Support & Documentation

For detailed feature documentation, see:
- `README.md` - Project overview and features
- `QUICKSTART.md` - Quick start guide
- `IMPLEMENTATION.md` - Technical implementation details

## License

This project is proprietary and confidential. All rights reserved.
