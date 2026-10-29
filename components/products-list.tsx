'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Download } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
        toast.success('Product deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete product')
      console.error('Error deleting product:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Out of Stock</Badge>
    if (quantity < 20) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">Low Stock</Badge>
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">In Stock</Badge>
  }

  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error('No products to export')
      return
    }

    const headers = ['SKU', 'Barcode', 'Product Name', 'Category', 'Price (₹)', 'Cost (₹)', 'Stock Quantity', 'GST Rate (%)', 'Status']
    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${p.barcode || ''}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      p.price.toFixed(2),
      (p.cost || 0).toFixed(2),
      p.quantity,
      p.gstRate,
      p.status,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `billflow_products_catalog_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Product catalog exported to CSV!')
  }

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading products...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage stock, prices, barcodes, and inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs">
            <Link href="/dashboard/products/new">
              <Plus className="w-4 h-4" />
              New Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card shadow-xs overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[22%]">Name</TableHead>
              <TableHead className="w-[15%]">SKU</TableHead>
              <TableHead className="w-[15%]">Category</TableHead>
              <TableHead className="w-[14%] text-right">Price</TableHead>
              <TableHead className="w-[12%] text-right">Quantity</TableHead>
              <TableHead className="w-[12%]">Stock Status</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-xs text-foreground">{product.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{product.category || '—'}</TableCell>
                  <TableCell className="text-right text-xs font-semibold">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-right font-medium text-xs">{product.quantity}</TableCell>
                  <TableCell>{getStockStatus(product.quantity)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
