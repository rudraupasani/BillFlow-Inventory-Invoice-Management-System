'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertCircle,
  TrendingDown,
  Package,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Download,
  Boxes,
  ArrowUpDown,
  History,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type AdjustmentType = 'purchase' | 'sale' | 'adjustment' | 'return'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Adjustment Modal State ("Adjust wala form")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<string>('')
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('purchase')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        setProducts(await res.json())
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  // Open adjustment modal for a specific product
  const handleOpenAdjustModal = (product: Product) => {
    setEditingProduct(product)
    setAdjustmentQuantity('')
    setAdjustmentType('purchase')
    setNotes('')
    setIsAdjustModalOpen(true)
  }

  // Calculate projected new stock based on adjustment type and input
  const calculateProjectedStock = () => {
    if (!editingProduct) return 0
    const current = editingProduct.quantity || 0
    const qty = parseInt(adjustmentQuantity) || 0

    if (adjustmentType === 'purchase' || adjustmentType === 'return') {
      return current + qty
    } else if (adjustmentType === 'sale') {
      return Math.max(0, current - qty)
    } else {
      // Direct adjustment / set exact stock
      return adjustmentQuantity === '' ? current : Math.max(0, qty)
    }
  }

  // Submit stock adjustment
  const handleSaveAdjustment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!editingProduct) return

    if (!adjustmentQuantity || parseInt(adjustmentQuantity) < 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    const newStock = calculateProjectedStock()

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: newStock,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        toast.success(`Stock for "${editingProduct.name}" updated to ${newStock} units!`)

        // Update local state
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, quantity: newStock } : p))
        )

        setIsAdjustModalOpen(false)
        setEditingProduct(null)
        setAdjustmentQuantity('')
        setNotes('')
      } else {
        toast.error('Failed to update inventory')
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error)
      toast.error('Error saving inventory adjustment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) {
      return {
        label: 'Out of Stock',
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200',
        dotClass: 'bg-red-500',
      }
    }
    if (product.quantity <= product.reorderLevel) {
      return {
        label: 'Low Stock',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
        dotClass: 'bg-amber-500',
      }
    }
    return {
      label: 'In Stock',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
      dotClass: 'bg-emerald-500',
    }
  }

  // Export inventory CSV
  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error('No inventory data to export')
      return
    }

    const headers = [
      'Product Name',
      'SKU',
      'Category',
      'Current Stock',
      'Reorder Level',
      'Cost Price (₹)',
      'Selling Price (₹)',
      'Total Value (₹)',
      'Stock Status',
    ]

    const rows = products.map((p) => {
      const val = (p.cost || p.price) * p.quantity
      const status = p.quantity === 0 ? 'Out of Stock' : p.quantity <= p.reorderLevel ? 'Low Stock' : 'In Stock'
      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.sku}"`,
        `"${p.category || 'General'}"`,
        p.quantity,
        p.reorderLevel,
        (p.cost || 0).toFixed(2),
        p.price.toFixed(2),
        val.toFixed(2),
        status,
      ]
    })

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `billflow_inventory_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Inventory exported to CSV!')
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm))

    if (!matchesSearch) return false

    if (statusFilter === 'out_of_stock') return p.quantity === 0
    if (statusFilter === 'low_stock') return p.quantity > 0 && p.quantity <= p.reorderLevel
    if (statusFilter === 'in_stock') return p.quantity > p.reorderLevel

    return true
  })

  // Summary Metrics
  const totalStockUnits = products.reduce((sum, p) => sum + p.quantity, 0)
  const totalValuation = products.reduce((sum, p) => sum + p.quantity * (p.cost || p.price), 0)
  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel).length
  const outOfStockCount = products.filter((p) => p.quantity === 0).length

  if (isLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading inventory products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="w-6 h-6 text-primary" />
            Inventory Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time stock levels, reorder alerts & adjust inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (products.length > 0) {
                handleOpenAdjustModal(products[0])
              } else {
                toast.error('No products available')
              }
            }}
            className="gap-1.5 text-xs bg-primary hover:bg-primary/90 text-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Quick Adjust Stock
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-border">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Products</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-foreground">{products.length}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{totalStockUnits} total items in stock</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Inventory Value</CardTitle>
            <span className="text-xs font-bold text-emerald-600">₹</span>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-foreground">
              ₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Based on purchase cost / price</p>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xs cursor-pointer transition-all border ${
            statusFilter === 'low_stock' ? 'ring-2 ring-amber-500 bg-amber-500/5' : 'border-border hover:bg-muted/30'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'low_stock' ? 'all' : 'low_stock')}
          title="Click to filter low stock items"
        >
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Low Stock Alert
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lowStockCount}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Below reorder threshold</p>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xs cursor-pointer transition-all border ${
            statusFilter === 'out_of_stock' ? 'ring-2 ring-red-500 bg-red-500/5' : 'border-border hover:bg-muted/30'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'out_of_stock' ? 'all' : 'out_of_stock')}
          title="Click to filter out of stock items"
        >
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-xs font-semibold text-destructive">Out of Stock</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Requires urgent restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory Products Card */}
      <Card className="shadow-xs border-border">
        <CardHeader className="py-4 px-5 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Inventory Products List ({filteredProducts.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Click the <span className="font-semibold text-primary">&quot;Adjust Stock&quot;</span> button on any product row to open the stock adjustment form.
              </CardDescription>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('low_stock')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'low_stock' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Low Stock ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('out_of_stock')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'out_of_stock' ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search product by name, SKU, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[28%]">Product Details</TableHead>
                  <TableHead className="w-[14%]">SKU / Barcode</TableHead>
                  <TableHead className="w-[14%] text-right">Price / Cost</TableHead>
                  <TableHead className="w-[12%] text-center">Stock Level</TableHead>
                  <TableHead className="w-[12%]">Status</TableHead>
                  <TableHead className="w-[20%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                      No inventory products match your search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(product)
                    const stockValue = (product.cost || product.price) * product.quantity

                    return (
                      <TableRow key={product.id} className="hover:bg-muted/30">
                        <TableCell className="text-xs">
                          <div className="font-semibold text-foreground">{product.name}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {product.category || 'General'} {product.unit ? `• ${product.unit}` : ''}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          <div>{product.sku}</div>
                          {product.barcode && (
                            <div className="text-[10px] text-muted-foreground/80">{product.barcode}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          <div className="font-semibold text-foreground">₹{product.price.toFixed(2)}</div>
                          {product.cost && (
                            <div className="text-[10px] text-muted-foreground">Cost: ₹{product.cost.toFixed(2)}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <div className="font-bold text-sm text-foreground">{product.quantity}</div>
                          <div className="text-[10px] text-muted-foreground">Reorder at: {product.reorderLevel}</div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${status.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* The Requested "Edit / Adjust Stock" Button */}
                            <Button
                              size="sm"
                              onClick={() => handleOpenAdjustModal(product)}
                              className="h-8 px-2.5 text-xs bg-primary hover:bg-primary/90 text-white font-medium gap-1.5 shadow-xs"
                              title="Adjust Stock Quantity (Purchase, Sale, Return, Count Correction)"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              <span>Adjust Stock</span>
                            </Button>

                            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0" title="Full Product Edit">
                              <Link href={`/dashboard/products/${product.id}`}>
                                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* The Requested "Adjust Stock" Modal Form ("Adjust wala form") */}
      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Adjust Inventory Stock
            </DialogTitle>
            <DialogDescription className="text-xs">
              Quickly record stock additions, sales deductions, returns, or physical count corrections.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <form onSubmit={handleSaveAdjustment} className="space-y-4 pt-2">
              {/* Product Info Banner */}
              <div className="p-3 bg-muted/50 border border-border rounded-lg space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-bold text-foreground text-sm">{editingProduct.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SKU: <span className="font-mono">{editingProduct.sku}</span></span>
                  <span>Category: {editingProduct.category || 'General'}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-border/60">
                  <span className="font-medium">Current Stock Level:</span>
                  <Badge variant="secondary" className="font-bold text-xs">
                    {editingProduct.quantity} units
                  </Badge>
                </div>
              </div>

              {/* Select Product Switcher inside modal in case user wants to switch */}
              <div className="space-y-1.5">
                <Label htmlFor="adjust-product-select" className="text-xs">
                  Switch Product
                </Label>
                <Select
                  value={editingProduct.id}
                  onValueChange={(val) => {
                    const prod = products.find((p) => p.id === val)
                    if (prod) setEditingProduct(prod)
                  }}
                >
                  <SelectTrigger id="adjust-product-select" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.name} (Stock: {p.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Adjustment Type Selector */}
              <div className="space-y-1.5">
                <Label htmlFor="adjust-type" className="text-xs font-semibold">
                  Adjustment Operation
                </Label>
                <Select value={adjustmentType} onValueChange={(v) => setAdjustmentType(v as AdjustmentType)}>
                  <SelectTrigger id="adjust-type" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase" className="text-xs">
                      🟢 Purchase / Stock In (Add +)
                    </SelectItem>
                    <SelectItem value="sale" className="text-xs">
                      🔴 Sale / Damaged / Write-off (Reduce -)
                    </SelectItem>
                    <SelectItem value="return" className="text-xs">
                      🔄 Customer Return (Add +)
                    </SelectItem>
                    <SelectItem value="adjustment" className="text-xs">
                      ✏️ Manual Count / Correction (Set Exact)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="adjust-qty" className="text-xs font-semibold">
                    {adjustmentType === 'adjustment' ? 'New Total Stock Amount' : 'Quantity Units'}
                  </Label>
                  {adjustmentQuantity !== '' && (
                    <span className="text-[11px] font-semibold text-primary">
                      Projected New Stock: {calculateProjectedStock()} units
                    </span>
                  )}
                </div>
                <Input
                  id="adjust-qty"
                  type="number"
                  placeholder={adjustmentType === 'adjustment' ? 'Enter exact new stock' : 'e.g., 10'}
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  min="0"
                  required
                  autoFocus
                  className="h-10 text-sm font-semibold"
                />
              </div>

              {/* Reason / Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="adjust-notes" className="text-xs">
                  Reason / Notes (Optional)
                </Label>
                <Input
                  id="adjust-notes"
                  placeholder="e.g., Supplier PO #402, monthly physical inventory count..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Footer */}
              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !adjustmentQuantity}
                  className="bg-primary hover:bg-primary/90 text-white text-xs gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Updating...' : `Save Stock (${calculateProjectedStock()} units)`}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
