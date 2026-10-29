// User Roles and Permissions
export type UserRole = 'owner' | 'admin' | 'manager' | 'staff'

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export interface RolePermissions {
  owner: {
    dashboard: Permission
    customers: Permission
    products: Permission
    invoices: Permission
    pos: Permission
    inventory: Permission
    reports: Permission
    settings: Permission
    users: Permission
  }
  admin: {
    dashboard: Permission
    customers: Permission
    products: Permission
    invoices: Permission
    pos: Permission
    inventory: Permission
    reports: Permission
    settings: Permission
    users: Omit<Permission, 'delete'>
  }
  manager: {
    dashboard: Permission
    customers: Permission
    products: Permission
    invoices: Permission
    pos: Permission
    inventory: Permission
    reports: Permission
    settings: Omit<Permission, 'delete' | 'update'>
    users: Omit<Permission, 'read' | 'create' | 'update' | 'delete'>
  }
  staff: {
    dashboard: Omit<Permission, 'create' | 'update' | 'delete'>
    customers: Omit<Permission, 'delete'>
    products: Omit<Permission, 'create' | 'update' | 'delete'>
    invoices: Omit<Permission, 'delete'>
    pos: Permission
    inventory: Omit<Permission, 'create' | 'delete'>
    reports: Omit<Permission, 'create' | 'update' | 'delete'>
    settings: Omit<Permission, 'read' | 'create' | 'update' | 'delete'>
    users: Omit<Permission, 'read' | 'create' | 'update' | 'delete'>
  }
}

// User and Authentication
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  storeId: string
  isActive: boolean
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  role?: UserRole
}

// Customers
export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  taxId?: string
  status: 'active' | 'inactive'
  outstandingBalance?: number
  createdAt: Date
  updatedAt: Date
}

// Products
export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  barcode?: string
  price: number
  cost?: number
  quantity: number
  reorderLevel: number
  category?: string
  gstRate: number // 0, 5, 12, 18, 28
  hsn?: string // HSN/SAC code
  unit?: string // pieces, kg, liters, etc
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// Billing & Invoices
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'cheque' | 'credit'

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customer?: Customer
  issueDate: Date
  dueDate: Date
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  discount?: number
  discountType?: 'percentage' | 'fixed'
  paymentMethod?: PaymentMethod
  paymentDate?: Date
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  isBill: boolean // true for POS bills, false for invoices
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  productId?: string
  product?: Product
  description: string
  quantity: number
  unitPrice: number
  gstRate: number
  gstAmount: number
  amount: number
}

// Inventory
export interface InventoryLog {
  id: string
  productId: string
  product?: Product
  type: 'purchase' | 'sale' | 'adjustment' | 'return'
  quantity: number
  notes?: string
  createdAt: Date
}

// Store Configuration
export interface Store {
  id: string
  name: string
  gstNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  phone?: string
  email?: string
  logo?: string
  upiId?: string
  createdAt: Date
  updatedAt: Date
}

export interface StoreSettings {
  id: string
  storeId: string
  invoicePrefix: string
  billPrefix: string
  invoiceFormat: 'detailed' | 'simple'
  billFormat: 'thermal' | 'a4'
  enableGST: boolean
  defaultGSTRate: number
  enableCreditNotes: boolean
  enableRecurringInvoices: boolean
  currencySymbol: string
  currencyCode: string
  theme: 'light' | 'dark'
  invoiceTemplate?: 'modern' | 'classic' | 'creative' | 'thermal'
  templateColor?: string
  upiId?: string
  invoiceLogo?: string
  invoiceFooter?: string
  receiptFooter?: string
  enableBarcode: boolean
  enableBarcodeLabel: boolean
  createdAt: Date
  updatedAt: Date
}

// Dashboard metrics
export interface DashboardMetrics {
  totalRevenue: number
  totalInvoices: number
  paidInvoices: number
  unpaidInvoices: number
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
  totalBills?: number
  todayRevenue?: number
  billsToday?: number
}
