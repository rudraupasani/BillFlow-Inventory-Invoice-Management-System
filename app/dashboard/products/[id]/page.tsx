'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({})

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          setFormData(data)
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id !== 'new') {
      fetchProduct()
    } else {
      setIsLoading(false)
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'cost' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const method = id === 'new' ? 'POST' : 'PUT'
      const url = id === 'new' ? '/api/products' : `/api/products/${id}`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(id === 'new' ? 'Product created' : 'Product updated')
        router.push('/dashboard/products')
      }
    } catch (error) {
      toast.error('Failed to save product')
      console.error('Error saving product:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id === 'new' ? 'New Product' : 'Edit Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Product name"
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input
                  name="sku"
                  value={formData.sku || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., PROD-001"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Product description"
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  placeholder="Category"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={isSaving}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cost</label>
                <Input
                  name="cost"
                  type="number"
                  value={formData.cost || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  name="quantity"
                  type="number"
                  value={formData.quantity || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
