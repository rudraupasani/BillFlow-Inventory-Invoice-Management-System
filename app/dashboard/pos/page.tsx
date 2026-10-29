'use client'

import { useState, useEffect } from 'react'
import { Product, Customer, Invoice, InvoiceItem, PaymentMethod } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  X,
  Plus,
  Minus,
  Receipt,
  Search,
  PauseCircle,
  PlayCircle,
  QrCode,
  Printer,
  MessageCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CartItem extends InvoiceItem {
  product: Product
}

interface ParkedBill {
  id: string
  savedAt: string
  customerId: string
  customerName: string
  items: CartItem[]
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash')
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')

  // Parked bills state
  const [parkedBills, setParkedBills] = useState<ParkedBill[]>([])
  const [isParkedModalOpen, setIsParkedModalOpen] = useState(false)

  // Payment UPI QR Modal & Post-sale receipt modal
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false)
  const [completedSale, setCompletedSale] = useState<{
    invoiceId?: string
    invoiceNumber: string
    total: number
    customerName: string
    customerPhone: string
    items: CartItem[]
  } | null>(null)

  useEffect(() => {
    loadData()
    // Load parked bills from localStorage
    try {
      const saved = localStorage.getItem('billflow_parked_bills')
      if (saved) setParkedBills(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Keyboard shortcuts (F2 Search, F8 Hold Cart, F9 Complete Sale)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        document.getElementById('pos-search-input')?.focus()
      } else if (e.key === 'F8') {
        e.preventDefault()
        if (cart.length > 0) {
          handleHoldCart()
        } else {
          toast.info('Cart is empty, nothing to hold')
        }
      } else if (e.key === 'F9') {
        e.preventDefault()
        if (cart.length > 0 && selectedCustomer && !isCheckingOut) {
          completeSale()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cart, selectedCustomer, discount, discountType, selectedPayment, isCheckingOut])

  const loadData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/customers'),
      ])

      if (productsRes.ok) setProducts(await productsRes.json())
      if (customersRes.ok) setCustomers(await customersRes.json())
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm))
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                amount: (item.quantity + 1) * item.unitPrice,
                gstAmount: (item.quantity + 1) * item.unitPrice * (item.gstRate / 100),
              }
            : item
        )
      )
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        product,
        description: product.name,
        quantity: 1,
        unitPrice: product.price,
        gstRate: product.gstRate,
        gstAmount: product.price * (product.gstRate / 100),
        amount: product.price + product.price * (product.gstRate / 100),
      }
      setCart([...cart, newItem])
    }
    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(
      cart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              amount: newQuantity * item.unitPrice,
              gstAmount: newQuantity * item.unitPrice * (item.gstRate / 100),
            }
          : item
      )
    )
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  }

  const calculateTax = () => {
    return cart.reduce((sum, item) => sum + item.gstAmount, 0)
  }

  const calculateDiscount = () => {
    const sub = calculateSubtotal()
    if (discountType === 'percentage') {
      return (sub * discount) / 100
    }
    return discount
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax()
  const discountAmount = calculateDiscount()
  const total = Math.max(0, subtotal + tax - discountAmount)

  // Hold / Park Cart
  const handleHoldCart = () => {
    if (cart.length === 0) {
      toast.error('Cannot hold an empty cart')
      return
    }

    const custObj = customers.find((c) => c.id === selectedCustomer)
    const newParked: ParkedBill = {
      id: `parked-${Date.now()}`,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: selectedCustomer || 'walk-in',
      customerName: custObj ? custObj.name : 'Walk-in Customer',
      items: [...cart],
      discount,
      discountType,
      total,
    }

    const updated = [newParked, ...parkedBills]
    setParkedBills(updated)
    localStorage.setItem('billflow_parked_bills', JSON.stringify(updated))

    // Reset current cart
    setCart([])
    setSelectedCustomer('')
    setDiscount(0)
    toast.success(`Cart parked (${newParked.items.length} items)`)
  }

  // Resume a parked bill
  const handleResumeParked = (bill: ParkedBill) => {
    if (cart.length > 0) {
      if (!confirm('You have items in your current cart. Replace with parked bill?')) return
    }

    setCart(bill.items)
    setSelectedCustomer(bill.customerId)
    setDiscount(bill.discount)
    setDiscountType(bill.discountType)

    // Remove from parked
    const updated = parkedBills.filter((b) => b.id !== bill.id)
    setParkedBills(updated)
    localStorage.setItem('billflow_parked_bills', JSON.stringify(updated))
    setIsParkedModalOpen(false)
    toast.success('Parked bill restored')
  }

  // Discard a parked bill
  const handleDiscardParked = (id: string) => {
    const updated = parkedBills.filter((b) => b.id !== id)
    setParkedBills(updated)
    localStorage.setItem('billflow_parked_bills', JSON.stringify(updated))
    toast.success('Parked bill discarded')
  }

  const completeSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!selectedCustomer) {
      toast.error('Please select a customer')
      return
    }

    setIsCheckingOut(true)
    const invoiceNum = `BILL-${Date.now()}`
    try {
      const billData: Partial<Invoice> = {
        customerId: selectedCustomer,
        items: cart,
        subtotal,
        tax,
        discount: discountAmount,
        discountType: discountType === 'percentage' ? 'percentage' : 'fixed',
        total,
        paymentMethod: selectedPayment,
        paymentDate: new Date(),
        status: 'paid',
        isBill: true,
        issueDate: new Date(),
        dueDate: new Date(),
        invoiceNumber: invoiceNum,
      }

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      })

      if (res.ok) {
        const createdInvoice = await res.json()
        const custObj = customers.find((c) => c.id === selectedCustomer)

        setCompletedSale({
          invoiceId: createdInvoice?.id,
          invoiceNumber: invoiceNum,
          total,
          customerName: custObj ? custObj.name : 'Walk-in Customer',
          customerPhone: custObj?.phone || '',
          items: [...cart],
        })

        toast.success('Sale completed successfully!')
        setCart([])
        setSelectedCustomer('')
        setDiscount(0)
      } else {
        toast.error('Failed to save bill')
      }
    } catch (error) {
      console.error('Error completing sale:', error)
      toast.error('Error completing sale')
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Direct WhatsApp share from POS
  const shareCompletedWhatsApp = () => {
    if (!completedSale) return
    const cleanPhone = completedSale.customerPhone.replace(/[^0-9]/g, '')
    const itemsList = completedSale.items
      .map((it) => `• ${it.description} x${it.quantity}: ₹${(it.unitPrice * it.quantity).toFixed(2)}`)
      .join('\n')

    const text = `🧾 *BILL: ${completedSale.invoiceNumber}*
Store: *BillFlow Retail*
Customer: ${completedSale.customerName}

*Items:*
${itemsList}

*Net Total Paid:* ₹${completedSale.total.toFixed(2)}
*Payment Method:* ${(selectedPayment || 'Cash').toUpperCase()}

Thank you for shopping with us! Have a wonderful day!`

    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const upiId = 'billflow@oksbi'
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=BillFlow&am=${total.toFixed(2)}&cu=INR&tn=POS-Sale`
  const upiQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayUrl)}`

  if (isLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading POS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {/* Top Header & Shortcuts Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            Point of Sale (POS)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rapid checkout, barcode scan & multi-cart management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Parked Bills Button with Badge */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsParkedModalOpen(true)}
            className="gap-2 relative"
          >
            <PauseCircle className="w-4 h-4 text-amber-500" />
            <span>Held Carts</span>
            {parkedBills.length > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 ml-1">
                {parkedBills.length}
              </Badge>
            )}
          </Button>

          {/* Shortcut Badges */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
            <span>Keys:</span>
            <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">F2 Search</kbd>
            <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">F8 Hold</kbd>
            <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">F9 Pay</kbd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="pos-search-input"
              placeholder="Search products by name, SKU, or barcode (Press F2)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 text-sm bg-card shadow-xs"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all border-border bg-card group"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 shrink-0 group-hover:bg-primary group-hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="text-base font-bold text-foreground">₹{product.price}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        product.quantity < product.reorderLevel
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      Stock: {product.quantity}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart & Billing Section */}
        <div className="flex flex-col gap-4">
          {/* Customer Selection */}
          <Card className="shadow-xs">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-semibold">Customer</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select or Walk-in Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.outstandingBalance ? `(Due: ₹${customer.outstandingBalance})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="flex flex-col shadow-xs">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Current Cart ({cart.length})
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHoldCart}
                  className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1"
                  title="Hold this cart and start a new one (F8)"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  Hold Cart
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-4 pb-4 max-h-[280px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Receipt className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Cart is empty</p>
                  <p className="text-xs text-muted-foreground mt-1">Click products to add items</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="p-2.5 bg-muted/40 rounded-lg border border-border/40">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs font-semibold text-foreground line-clamp-1">
                          {item.product.name}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                        <span>₹{item.unitPrice} × {item.quantity}</span>
                        <span className="font-semibold text-foreground">
                          ₹{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-7 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="h-6 w-12 p-0 text-center text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-7 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount & Totals */}
          <Card className="shadow-xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Discount"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="flex-1 h-8 text-xs"
                />
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as any)}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">₹ Fixed</SelectItem>
                    <SelectItem value="percentage">% Pct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-border pt-2 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-destructive font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base text-foreground">
                  <span>Net Total</span>
                  <span className="text-primary text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-xs">
            <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold">Payment Mode</CardTitle>
              {total > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUpiModalOpen(true)}
                  className="h-6 text-[11px] text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1 gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  Show UPI QR
                </Button>
              )}
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <Select value={selectedPayment} onValueChange={(v) => setSelectedPayment(v as PaymentMethod)}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">💵 Cash Payment</SelectItem>
                  <SelectItem value="upi">📱 UPI / QR Code</SelectItem>
                  <SelectItem value="card">💳 Card (Debit/Credit)</SelectItem>
                  <SelectItem value="credit">📒 Credit / Khata (Pay Later)</SelectItem>
                  <SelectItem value="cheque">🏦 Cheque</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={completeSale}
              disabled={cart.length === 0 || !selectedCustomer || isCheckingOut}
              className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              {isCheckingOut ? 'Processing...' : `Complete Sale (₹${total.toFixed(2)}) [F9]`}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleHoldCart}
                disabled={cart.length === 0}
                className="flex-1 text-xs"
              >
                Hold Cart [F8]
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCart([])
                  setSelectedCustomer('')
                  setDiscount(0)
                }}
                className="flex-1 text-xs text-destructive hover:bg-destructive/10"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Parked / Held Carts Modal Dialog */}
      <Dialog open={isParkedModalOpen} onOpenChange={setIsParkedModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <PauseCircle className="w-5 h-5 text-amber-500" />
              Parked / Held Bills ({parkedBills.length})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Resume a previously held transaction or discard it
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto py-2">
            {parkedBills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No held bills right now. Click &quot;Hold Cart&quot; during an active sale to park a cart.
              </div>
            ) : (
              parkedBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-3 bg-muted/40 border border-border rounded-lg flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">{bill.customerName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {bill.items.length} items • Held at {bill.savedAt}
                    </p>
                    <p className="text-xs font-semibold text-primary">₹{bill.total.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => handleResumeParked(bill)}
                      className="h-8 text-xs gap-1 bg-primary text-white"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDiscardParked(bill.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Instant UPI QR Code Dialog during Checkout */}
      <Dialog open={isUpiModalOpen} onOpenChange={setIsUpiModalOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-base font-bold">Counter UPI Payment</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Show this QR code to the customer to scan with any UPI app
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-2 space-y-3">
            <div className="p-3 bg-white border border-border rounded-xl shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upiQrImg}
                alt="UPI QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">₹{total.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">VPA: <span className="font-semibold text-foreground">{upiId}</span></p>
            </div>
            <Button
              className="w-full text-xs"
              variant="outline"
              onClick={() => {
                setIsUpiModalOpen(false)
                setSelectedPayment('upi')
                toast.success('Payment method set to UPI')
              }}
            >
              Done Scanning
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post-Checkout Success Modal with WhatsApp Share & Print Actions */}
      <Dialog open={!!completedSale} onOpenChange={() => setCompletedSale(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">Sale Completed!</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Bill <span className="font-semibold text-foreground">{completedSale?.invoiceNumber}</span> created successfully
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-semibold">{completedSale?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span>{completedSale?.items.length} items</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-border">
              <span>Amount Paid:</span>
              <span className="text-primary">₹{completedSale?.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              onClick={shareCompletedWhatsApp}
              className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Bill
            </Button>

            {completedSale?.invoiceId && (
              <Button variant="outline" asChild className="gap-1.5 text-xs">
                <Link href={`/dashboard/invoices/${completedSale.invoiceId}`}>
                  <Printer className="w-3.5 h-3.5" />
                  Thermal Print
                </Link>
              </Button>
            )}
          </div>

          <Button
            onClick={() => setCompletedSale(null)}
            className="w-full bg-primary text-white text-xs mt-2"
          >
            Start New Sale
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
