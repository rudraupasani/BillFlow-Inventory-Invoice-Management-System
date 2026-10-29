# BillFlow Quick Start Guide

## Installation & Setup (2 minutes)

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Install & Run
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

## First Login

1. Go to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to the login page
3. Enter any email and password (demo mode accepts any credentials)
4. Example:
   - Email: `demo@example.com`
   - Password: `password123`

## Tour of the App

### Dashboard
- **Location**: Home page after login
- **Shows**: Total revenue, customers, products, invoices
- **Alerts**: Unpaid invoices and low stock warnings
- **Charts**: Coming soon in reports

### Customers
- **Location**: Left sidebar → Customers
- **Actions**: Create, view, edit, delete customers
- **Fields**: Name, email, phone, address, city, state, zip, country, status

### Products
- **Location**: Left sidebar → Products  
- **Actions**: Create, view, edit, delete products
- **Fields**: Name, SKU, price, cost, quantity, category, status
- **Alerts**: Shows low stock status for each product

### Invoices
- **Location**: Left sidebar → Invoices
- **Actions**: Create, view, edit, delete invoices
- **Fields**: Invoice number, customer, items, dates, tax, total, status
- **Statuses**: Draft, Sent, Paid, Overdue, Cancelled

### Reports
- **Location**: Left sidebar → Reports
- **Shows**: Revenue trends, invoice distribution, key metrics
- **Visualizations**: Line and bar charts with Recharts

## Creating Your First Invoice

1. Click **Invoices** in sidebar
2. Click **New Invoice** button
3. Select a customer
4. Add line items (products)
5. System calculates subtotal, tax, total automatically
6. Set status (Draft, Sent, etc.)
7. Click **Save**

## Common Tasks

### Add a New Customer
1. Go to Customers
2. Click "New Customer"
3. Fill in details
4. Click "Save Customer"

### Update Product Inventory
1. Go to Products
2. Click the product name to edit
3. Change quantity field
4. Click "Save Product"

### Check Revenue
1. Go to Dashboard
2. See "Total Revenue" card
3. Or go to Reports for detailed charts

### Mark Invoice as Paid
1. Go to Invoices
2. Click invoice number
3. Change status to "Paid"
4. Click "Save"

## Tips & Tricks

### Demo Data
- The app comes with sample customers, products, and invoices
- Use these for testing before adding your own data

### Dark Mode
- Dark mode is enabled by default
- Matches modern SaaS aesthetic

### Responsive Design
- Works on desktop, tablet, and mobile
- Try resizing your browser

### Real-time Updates
- Data updates instantly across the app
- No need to refresh

## Understanding the Data

### Invoice Calculations
- **Subtotal** = Sum of all line item amounts
- **Tax** = 10% of subtotal (example rate)
- **Total** = Subtotal + Tax

### Stock Status
- **In Stock**: Quantity > 20
- **Low Stock**: Quantity < 20
- **Out of Stock**: Quantity = 0

### Invoice Statuses
- **Draft**: Not sent to customer yet
- **Sent**: Sent but not paid
- **Paid**: Payment received
- **Overdue**: Past due date
- **Cancelled**: Void invoice

## Troubleshooting

### "Login failed" message
- Try entering any email/password combination
- Demo mode should accept anything

### Data not saving
- Check browser console (F12) for errors
- Refresh the page (Ctrl+R)

### Session expired
- Log out and log back in
- Clear browser cache if needed

### Charts not showing
- Make sure you're on the Reports page
- Charts use Recharts library

## Next Steps

### Learn the Codebase
1. Check `README.md` for architecture
2. Check `IMPLEMENTATION.md` for details
3. Explore code in `/app` and `/components`

### Add Features
1. Create new API route in `/app/api`
2. Create new component in `/components`
3. Create new page in `/app/dashboard`

### Deploy to Production
1. Push code to GitHub
2. Connect to Vercel
3. Deploy with one click
4. Add real database (Supabase recommended)

### Migrate to Real Database
1. Set up Supabase account
2. Update `/lib/db.ts` with Supabase SDK
3. Create tables matching the types
4. No UI changes needed!

## Key Files

| File | Purpose |
|------|---------|
| `lib/db.ts` | Mock database layer |
| `lib/auth-context.tsx` | Authentication state |
| `lib/types.ts` | TypeScript interfaces |
| `app/api/` | All API endpoints |
| `app/dashboard/` | All dashboard pages |
| `components/` | Reusable components |

## Performance Tips

- Products are cached on first load
- Invoices load quickly due to mock DB
- Reports are pre-calculated
- No database latency

## Support

- Check README.md for full documentation
- Check IMPLEMENTATION.md for technical details
- Review TypeScript types in lib/types.ts
- Look at example API routes in app/api

## What's Next?

This MVP is ready for:
- Adding real database (Supabase)
- Adding user authentication (Auth.js)
- Adding payment processing (Stripe)
- Deploying to Vercel
- Adding team collaboration
- Creating mobile app

Happy building! 🚀
