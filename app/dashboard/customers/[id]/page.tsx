'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Customer, Invoice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Customer>>({})

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const [custRes, invRes] = await Promise.all([
          fetch(`/api/customers/${id}`),
          fetch('/api/invoices'),
        ])

        if (custRes.ok) {
          const data = await custRes.json()
          setCustomer(data)
          setFormData(data)
        }

        if (invRes.ok) {
          const allInvoices = await invRes.json()
          const customerInvoices = allInvoices.filter((inv: Invoice) => inv.customerId === id)
          setInvoices(customerInvoices)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch customer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id !== 'new') {
      fetchCustomer()
    } else {
      setIsLoading(false)
      setFormData({ status: 'active' })
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const method = id === 'new' ? 'POST' : 'PUT'
      const url = id === 'new' ? '/api/customers' : `/api/customers/${id}`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(id === 'new' ? 'Customer created' : 'Customer updated')
        router.push('/dashboard/customers')
      }
    } catch (error) {
      toast.error('Failed to save customer')
      console.error('Error saving customer:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalInvoices = invoices.length
  const unpaidAmount = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/customers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Link>
        </Button>
      </div>

      {/* Customer Stats */}
      {customer && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-2xl font-bold">{totalInvoices}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{unpaidAmount.toFixed(2)}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{id === 'new' ? 'New Customer' : 'Edit Customer'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Customer name"
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  placeholder="customer@example.com"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax ID</label>
                <Input
                  name="taxId"
                  value={formData.taxId || ''}
                  onChange={handleInputChange}
                  placeholder="Tax ID"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Street address"
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  placeholder="City"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State/Province</label>
                <Input
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  placeholder="State"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Zip Code</label>
                <Input
                  name="zipCode"
                  value={formData.zipCode || ''}
                  onChange={handleInputChange}
                  placeholder="12345"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input
                  name="country"
                  value={formData.country || ''}
                  onChange={handleInputChange}
                  placeholder="USA"
                  disabled={isSaving}
                />
              </div>
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

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Customer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/customers">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Purchase History */}
      {id !== 'new' && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No purchases yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className="text-primary hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.items.length}</TableCell>
                      <TableCell className="text-right font-bold">₹{invoice.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === 'paid'
                              ? 'default'
                              : invoice.status === 'sent'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
