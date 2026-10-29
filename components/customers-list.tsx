'use client'

import { useState, useEffect } from 'react'
import { Customer } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Download, CreditCard, Search, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Payment Recording Modal
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState<Customer | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('')
  const [paymentMode, setPaymentMode] = useState('cash')
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setCustomers(customers.filter((c) => c.id !== id))
        toast.success('Customer deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete customer')
      console.error('Error deleting customer:', error)
    }
  }

  // Handle Khata / Due Balance Payment Recording
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomerForPayment || !paymentAmount || paymentAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsSubmittingPayment(true)
    try {
      const currentDue = selectedCustomerForPayment.outstandingBalance || 0
      const newDue = Math.max(0, currentDue - Number(paymentAmount))

      const res = await fetch(`/api/customers/${selectedCustomerForPayment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outstandingBalance: newDue,
        }),
      })

      if (res.ok) {
        toast.success(`Payment of ₹${paymentAmount} recorded successfully!`)
        setCustomers(
          customers.map((c) =>
            c.id === selectedCustomerForPayment.id
              ? { ...c, outstandingBalance: newDue }
              : c
          )
        )
        setSelectedCustomerForPayment(null)
        setPaymentAmount('')
      } else {
        toast.error('Failed to record payment')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error recording payment')
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error('No customers to export')
      return
    }

    const headers = ['Name', 'Email', 'Phone', 'City', 'State', 'GSTIN/TaxID', 'Outstanding Due (₹)', 'Status']
    const rows = customers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.city || ''}"`,
      `"${c.state || ''}"`,
      `"${c.taxId || ''}"`,
      (c.outstandingBalance || 0).toFixed(2),
      c.status,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `billflow_customers_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Customer report downloaded as CSV!')
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  )

  const totalDues = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0)

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading customers...</div>
  }

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers & Khata Ledger</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total Outstanding Balance across customers: <span className="font-semibold text-destructive">₹{totalDues.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs">
            <Link href="/dashboard/customers/new">
              <Plus className="w-4 h-4" />
              New Customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer name, phone or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Customers Table */}
      <div className="border border-border rounded-lg bg-card shadow-xs overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[24%]">Name</TableHead>
              <TableHead className="w-[20%]">Contact</TableHead>
              <TableHead className="w-[14%]">City / State</TableHead>
              <TableHead className="w-[18%]">Khata / Due (₹)</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[14%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => {
                const due = customer.outstandingBalance || 0
                return (
                  <TableRow key={customer.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-foreground text-xs">
                      <div>{customer.name}</div>
                      {customer.taxId && (
                        <div className="text-[10px] text-muted-foreground font-normal">GST: {customer.taxId}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div>{customer.email || '—'}</div>
                      {customer.phone && (
                        <div className="text-[11px] text-muted-foreground">{customer.phone}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {customer.city ? `${customer.city}${customer.state ? ', ' + customer.state : ''}` : '—'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {due > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          ₹{due.toFixed(2)} Due
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          All Clear
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-[10px]'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-[10px]'
                        }
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {/* Record Repayment Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomerForPayment(customer)
                          setPaymentAmount(due > 0 ? due : '')
                        }}
                        className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Record Payment / Settle Due"
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1" />
                        Pay
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                        <Link href={`/dashboard/customers/${customer.id}`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Record Payment / Settle Due Modal Dialog */}
      <Dialog
        open={!!selectedCustomerForPayment}
        onOpenChange={() => setSelectedCustomerForPayment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Record Customer Payment (Khata Settlement)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record a repayment to deduct from customer&apos;s outstanding credit balance
            </DialogDescription>
          </DialogHeader>

          {selectedCustomerForPayment && (
            <form onSubmit={handleRecordPayment} className="space-y-4 pt-2">
              <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground">{selectedCustomerForPayment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Due Balance:</span>
                  <span className="font-bold text-destructive">
                    ₹{(selectedCustomerForPayment.outstandingBalance || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-amt" className="text-xs">Payment Amount (₹)</Label>
                <Input
                  id="payment-amt"
                  type="number"
                  placeholder="Enter amount paid"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  min="1"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-mode" className="text-xs">Payment Method</Label>
                <select
                  id="payment-mode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / Online</option>
                  <option value="bank">Bank Transfer / IMPS</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCustomerForPayment(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isSubmittingPayment ? 'Saving...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
