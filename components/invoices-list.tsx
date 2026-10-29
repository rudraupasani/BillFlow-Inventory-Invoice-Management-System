'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Invoice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Download, Search, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number | undefined) => {
    const val = amount || 0
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Export to Excel
  const handleExportExcel = async () => {
    if (invoices.length === 0) {
      toast.error('No invoices to export')
      return
    }

    try {
      const { utils, writeFile } = await import('xlsx')

      const rows = invoices.map((inv) => ({
        'Invoice Number': inv.invoiceNumber,
        'Customer': inv.customer?.name || 'Walk-in',
        'Issue Date': new Date(inv.issueDate || inv.createdAt).toISOString().slice(0, 10),
        'Due Date': new Date(inv.dueDate || inv.createdAt).toISOString().slice(0, 10),
        'Subtotal (₹)': parseFloat((inv.subtotal || 0).toFixed(2)),
        'Tax (₹)': parseFloat((inv.tax || 0).toFixed(2)),
        'Total Amount (₹)': parseFloat((inv.total || 0).toFixed(2)),
        'Payment Method': (inv.paymentMethod || 'cash').toUpperCase(),
        'Status': inv.status.toUpperCase(),
      }))

      const worksheet = utils.json_to_sheet(rows)

      // Auto-size columns
      const colWidths = Object.keys(rows[0] || {}).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key as keyof typeof r] ?? '').length)) + 2,
      }))
      worksheet['!cols'] = colWidths

      const workbook = utils.book_new()
      utils.book_append_sheet(workbook, worksheet, 'Invoices')

      writeFile(workbook, `billflow_invoices_report_${new Date().toISOString().slice(0, 10)}.xlsx`)
      toast.success(`${rows.length} invoice(s) exported to Excel!`)
    } catch (err) {
      console.error('Excel export failed:', err)
      toast.error('Failed to export Excel file')
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customer?.name && inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading invoices...</div>
  }

  return (
    <div className="space-y-4">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage billing, receipts, export data, and generate templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-1.5 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs">
            <Link href="/dashboard/invoices/new">
              <Plus className="w-4 h-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'paid', 'sent', 'draft', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                selectedStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg bg-card shadow-xs overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[18%]">Invoice Number</TableHead>
              <TableHead className="w-[22%]">Customer</TableHead>
              <TableHead className="w-[12%]">Issue Date</TableHead>
              <TableHead className="w-[12%]">Due Date</TableHead>
              <TableHead className="w-[14%]">Amount</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[12%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  No invoices found matching criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-xs text-foreground">
                    <div>{invoice.invoiceNumber}</div>
                    {invoice.isBill && (
                      <span className="text-[10px] text-muted-foreground font-normal">POS Bill</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{invoice.customer?.name || 'Walk-in Customer'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[invoice.status] || 'bg-gray-100'} text-[10px]`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                          <Eye className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                          <span>View</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="h-8 gap-1 text-xs">
                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                          <Download className="w-3.5 h-3.5 text-primary" />
                          <span>PDF</span>
                        </Link>
                      </Button>
                    </div>
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
