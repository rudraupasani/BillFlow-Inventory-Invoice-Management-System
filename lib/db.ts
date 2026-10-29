import { User, Customer, Product, Invoice, InvoiceItem, InventoryLog, DashboardMetrics, Store, StoreSettings } from './types'

// Mock data storage - in production this would be Supabase
let users: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Alex Rivera',
    role: 'owner',
    storeId: 'store-1',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    email: 'admin@billflow.com',
    name: 'Sarah Connor',
    role: 'admin',
    storeId: 'store-1',
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'user-3',
    email: 'manager@billflow.com',
    name: 'Michael Scott',
    role: 'manager',
    storeId: 'store-1',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'user-4',
    email: 'staff@billflow.com',
    name: 'Jim Halpert',
    role: 'staff',
    storeId: 'store-1',
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
]

let stores: Store[] = [
  {
    id: 'store-1',
    name: 'My Store',
    gstNumber: '27AAFCT5055K1ZO',
    address: '123 Business Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
    phone: '+91-9876543210',
    email: 'store@example.com',
    upiId: 'billflow@oksbi',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

let storeSettings: StoreSettings[] = [
  {
    id: 'settings-1',
    storeId: 'store-1',
    invoicePrefix: 'INV',
    billPrefix: 'BILL',
    invoiceFormat: 'detailed',
    billFormat: 'thermal',
    enableGST: true,
    defaultGSTRate: 18,
    enableCreditNotes: true,
    enableRecurringInvoices: false,
    currencySymbol: '₹',
    currencyCode: 'INR',
    theme: 'dark',
    invoiceTemplate: 'modern',
    templateColor: 'indigo',
    upiId: 'billflow@oksbi',
    enableBarcode: true,
    enableBarcodeLabel: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

let customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '(555) 123-4567',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    status: 'active',
    outstandingBalance: 1450,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'cust-2',
    name: 'Tech Startup Inc',
    email: 'billing@techstartup.com',
    phone: '(555) 987-6543',
    address: '456 Innovation Dr',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    status: 'active',
    outstandingBalance: 0,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
]

let products: Product[] = [
  {
    id: 'prod-1',
    name: 'Professional Services Package',
    description: 'Complete consultation and implementation',
    sku: 'PSP-001',
    barcode: '8901234567890',
    price: 5000,
    cost: 2000,
    quantity: 100,
    reorderLevel: 10,
    category: 'Services',
    gstRate: 18,
    hsn: '998361',
    unit: 'pieces',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'prod-2',
    name: 'Software License',
    description: 'Annual software license subscription',
    sku: 'SL-001',
    barcode: '8901234567891',
    price: 1200,
    cost: 300,
    quantity: 500,
    reorderLevel: 50,
    category: 'Software',
    gstRate: 18,
    hsn: '998361',
    unit: 'pieces',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'prod-3',
    name: 'Support Package',
    description: '24/7 technical support',
    sku: 'SUP-001',
    barcode: '8901234567892',
    price: 300,
    cost: 100,
    quantity: 15,
    reorderLevel: 5,
    category: 'Support',
    gstRate: 18,
    hsn: '998361',
    unit: 'pieces',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
]

let invoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    customerId: 'cust-1',
    customer: customers[0],
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-03-01'),
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        product: products[0],
        description: 'Professional Services Package',
        quantity: 1,
        unitPrice: 5000,
        gstRate: 18,
        gstAmount: 900,
        amount: 5900,
      },
    ],
    subtotal: 5000,
    tax: 900,
    paymentMethod: 'cash',
    isBill: false,
    total: 5500,
    status: 'paid',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    customerId: 'cust-2',
    customer: customers[1],
    issueDate: new Date('2024-03-01'),
    dueDate: new Date('2024-04-01'),
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        product: products[1],
        description: 'Software License',
        quantity: 2,
        unitPrice: 1200,
        gstRate: 18,
        gstAmount: 432,
        amount: 2832,
      },
    ],
    subtotal: 2400,
    tax: 432,
    paymentMethod: 'upi',
    isBill: false,
    total: 2640,
    status: 'sent',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
]

let inventoryLogs: InventoryLog[] = [
  {
    id: 'log-1',
    productId: 'prod-1',
    product: products[0],
    type: 'purchase',
    quantity: 50,
    notes: 'Initial stock purchase',
    createdAt: new Date('2024-01-10'),
  },
]

// Database queries
export const db = {
  // User queries
  getUser: async (id: string) => {
    return users.find((u) => u.id === id)
  },
  getUserByEmail: async (email: string) => {
    return users.find((u) => u.email === email)
  },
  createUser: async (user: Omit<User, 'createdAt'>) => {
    const newUser = { ...user, createdAt: new Date() }
    users.push(newUser)
    return newUser
  },

  // Customer queries
  getCustomers: async () => {
    return customers
  },
  getCustomer: async (id: string) => {
    return customers.find((c) => c.id === id)
  },
  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    customers.push(newCustomer)
    return newCustomer
  },
  updateCustomer: async (id: string, updates: Partial<Customer>) => {
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return null
    customers[index] = { ...customers[index], ...updates, updatedAt: new Date() }
    return customers[index]
  },
  deleteCustomer: async (id: string) => {
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return false
    customers.splice(index, 1)
    return true
  },

  // Product queries
  getProducts: async () => {
    return products
  },
  getProduct: async (id: string) => {
    return products.find((p) => p.id === id)
  },
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    products.push(newProduct)
    return newProduct
  },
  updateProduct: async (id: string, updates: Partial<Product>) => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null
    products[index] = { ...products[index], ...updates, updatedAt: new Date() }
    return products[index]
  },
  deleteProduct: async (id: string) => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false
    products.splice(index, 1)
    return true
  },

  // Invoice queries
  getInvoices: async () => {
    return invoices.map((inv) => ({
      ...inv,
      customer: customers.find((c) => c.id === inv.customerId),
    }))
  },
  getInvoice: async (id: string) => {
    const invoice = invoices.find((i) => i.id === id)
    if (!invoice) return null
    return {
      ...invoice,
      customer: customers.find((c) => c.id === invoice.customerId),
    }
  },
  createInvoice: async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    invoices.push(newInvoice)

    // If payment method is credit, add to customer outstanding balance
    if (invoice.paymentMethod === 'credit' && invoice.customerId) {
      const cust = customers.find((c) => c.id === invoice.customerId)
      if (cust) {
        cust.outstandingBalance = (cust.outstandingBalance || 0) + invoice.total
        cust.updatedAt = new Date()
      }
    }

    return newInvoice
  },
  recordCustomerPayment: async (customerId: string, amount: number) => {
    const cust = customers.find((c) => c.id === customerId)
    if (!cust) return null
    cust.outstandingBalance = Math.max(0, (cust.outstandingBalance || 0) - amount)
    cust.updatedAt = new Date()
    return cust
  },
  updateInvoice: async (id: string, updates: Partial<Invoice>) => {
    const index = invoices.findIndex((i) => i.id === id)
    if (index === -1) return null
    invoices[index] = { ...invoices[index], ...updates, updatedAt: new Date() }
    return invoices[index]
  },
  deleteInvoice: async (id: string) => {
    const index = invoices.findIndex((i) => i.id === id)
    if (index === -1) return false
    invoices.splice(index, 1)
    return true
  },

  // Store queries
  getStore: async (id: string) => {
    return stores.find((s) => s.id === id)
  },
  updateStore: async (id: string, updates: Partial<Store>) => {
    const index = stores.findIndex((s) => s.id === id)
    if (index === -1) return null
    stores[index] = { ...stores[index], ...updates, updatedAt: new Date() }
    return stores[index]
  },

  // Store Settings queries
  getStoreSettings: async (storeId: string) => {
    return storeSettings.find((s) => s.storeId === storeId)
  },
  updateStoreSettings: async (id: string, updates: Partial<StoreSettings>) => {
    const index = storeSettings.findIndex((s) => s.id === id)
    if (index === -1) return null
    storeSettings[index] = { ...storeSettings[index], ...updates, updatedAt: new Date() }
    return storeSettings[index]
  },

  // Dashboard metrics
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const paidInvoices = invoices.filter((i) => i.status === 'paid')
    const unpaidInvoices = invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
    const lowStockProducts = products.filter((p) => p.quantity < p.reorderLevel)
    const totalBills = invoices.filter((i) => i.isBill).length
    const todayBills = invoices.filter((i) => i.isBill && i.createdAt.toDateString() === new Date().toDateString())
    const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.total, 0)

    return {
      totalRevenue: paidInvoices.reduce((sum, inv) => sum + inv.total, 0),
      totalInvoices: invoices.length,
      paidInvoices: paidInvoices.length,
      unpaidInvoices: unpaidInvoices.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length,
      totalBills,
      billsToday: todayBills.length,
      todayRevenue,
    }
  },
}
