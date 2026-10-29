'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Customer, Product, InvoiceItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewInvoicePage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState<string>('Thank you for choosing BillFlow!')
  const [items, setItems] = useState<
    Array<{
      description: string
      quantity: number
      unitPrice: number
      gstRate: number
      amount: number
    }>
  >([
    { description: 'Consulting & Setup Services', quantity: 1, unitPrice: 5000, gstRate: 18, amount: 5000 },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/products'),
        ])
        if (cRes.ok) setCustomers(await cRes.json())
        if (pRes.ok) setProducts(await pRes.json())
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'New Item', quantity: 1, unitPrice: 1000, gstRate: 18, amount: 1000 },
    ])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.error('Invoice must contain at least 1 item')
      return
    }
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    const current = { ...newItems[index], [field]: value }
    const qty = Number(current.quantity) || 1
    const price = Number(current.unitPrice) || 0
    current.amount = qty * price
    newItems[index] = current
    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const tax = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.gstRate / 100)), 0)
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) {
      toast.error('Please select a customer')
      return
    }

    setIsSubmitting(true)
    try {
      const invoicePayload = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        customerId: selectedCustomer,
        issueDate: new Date(),
        dueDate: new Date(dueDate),
        items: items.map((it, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          description: it.description,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          gstRate: Number(it.gstRate),
          gstAmount: (Number(it.quantity) * Number(it.unitPrice) * Number(it.gstRate)) / 100,
          amount: Number(it.amount),
        })),
        subtotal,
        tax,
        total,
        status: 'sent',
        notes,
        isBill: false,
      }

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload),
      })

      if (res.ok) {
        const created = await res.json()
        toast.success('Invoice created successfully!')
        router.push(`/dashboard/invoices/${created.id}`)
      } else {
        toast.error('Failed to create invoice')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error creating invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/invoices">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Create New Invoice</h1>
          <p className="text-xs text-muted-foreground">Enter invoice details to generate and select a template</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer & Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Select Customer *</label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.taxId ? `(${c.taxId})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Due Date *</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Invoice Line Items</CardTitle>
              <CardDescription className="text-xs">Add items or services to bill</CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={handleAddItem} className="gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground text-left">
                    <th className="pb-2 w-1/2">Description</th>
                    <th className="pb-2 w-20 text-center">Qty</th>
                    <th className="pb-2 w-28 text-right">Unit Price (₹)</th>
                    <th className="pb-2 w-20 text-center">GST %</th>
                    <th className="pb-2 w-28 text-right">Total (₹)</th>
                    <th className="pb-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2 pr-2">
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Item name / description"
                          required
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="py-2 px-1">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="h-8 text-xs text-center"
                        />
                      </td>
                      <td className="py-2 px-1">
                        <Input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs text-right font-mono"
                        />
                      </td>
                      <td className="py-2 px-1">
                        <Select
                          value={item.gstRate.toString()}
                          onValueChange={(val) => handleItemChange(idx, 'gstRate', parseFloat(val))}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-1 text-right font-mono font-semibold">
                        ₹{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="py-2 pl-2 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(idx)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="flex justify-end pt-4 border-t">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST:</span>
                  <span className="font-mono">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t text-foreground">
                  <span>Grand Total:</span>
                  <span className="font-mono text-primary text-base">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes & Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment instructions, bank details, or thank you note"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/invoices">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
            {isSubmitting ? 'Creating Invoice...' : 'Create & View Templates'}
          </Button>
        </div>
      </form>
    </div>
  )
}
