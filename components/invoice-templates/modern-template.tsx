'use client'

import React from 'react'
import { Invoice, Store } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

interface TemplateProps {
  invoice: Invoice
  store?: Store | null
  accentColor?: string
}

export function ModernTemplate({ invoice, store, accentColor = 'indigo' }: TemplateProps) {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number | undefined) => {
    const val = amount || 0
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const colorStyles: Record<string, { banner: string; text: string; bg: string; border: string }> = {
    indigo: { banner: 'bg-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    emerald: { banner: 'bg-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    blue: { banner: 'bg-blue-600', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    rose: { banner: 'bg-rose-600', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    violet: { banner: 'bg-violet-600', text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    slate: { banner: 'bg-slate-800', text: 'text-slate-800', bg: 'bg-slate-100', border: 'border-slate-300' },
  }

  const currentTheme = colorStyles[accentColor] || colorStyles.indigo

  const statusConfig: Record<string, { label: string; class: string }> = {
    paid: { label: 'PAID', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    sent: { label: 'SENT', class: 'bg-blue-100 text-blue-800 border-blue-300' },
    overdue: { label: 'OVERDUE', class: 'bg-rose-100 text-rose-800 border-rose-300' },
    draft: { label: 'DRAFT', class: 'bg-slate-100 text-slate-800 border-slate-300' },
    cancelled: { label: 'CANCELLED', class: 'bg-gray-100 text-gray-800 border-gray-300' },
  }

  const statusBadge = statusConfig[invoice.status] || { label: invoice.status.toUpperCase(), class: 'bg-slate-100 text-slate-800' }

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full">
      {/* Top Accent Strip */}
      <div className={`h-2.5 w-full ${currentTheme.banner} rounded-t-lg -mt-8 -mx-8 mb-8 sm:-mt-12 sm:-mx-12 sm:mb-10 sm:w-[calc(100%+6rem)] print:hidden`} />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg ${currentTheme.banner} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
              {store?.name ? store.name.charAt(0) : 'B'}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{store?.name || 'BillFlow Store'}</h1>
              <p className="text-xs text-slate-500 font-medium">Billing & Inventory Management</p>
            </div>
          </div>
          <div className="text-xs text-slate-600 space-y-1 mt-3">
            {store?.gstNumber && <p><span className="font-semibold text-slate-700">GSTIN:</span> {store.gstNumber}</p>}
            <p>{store?.address || '123 Business Avenue, Suite 400'}</p>
            <p>{store?.city || 'Mumbai'}, {store?.state || 'Maharashtra'} - {store?.zipCode || '400001'}</p>
            <p>Email: {store?.email || 'billing@billflow.com'} | Phone: {store?.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        <div className="sm:text-right space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">INVOICE</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge.class}`}>
              {statusBadge.label}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{invoice.invoiceNumber}</p>
          <div className="text-xs text-slate-600 space-y-1 pt-1">
            <p><span className="font-semibold text-slate-700">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
            <p><span className="font-semibold text-slate-700">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            {invoice.paymentMethod && (
              <p><span className="font-semibold text-slate-700">Payment:</span> <span className="capitalize">{invoice.paymentMethod}</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Bill To & Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Billed To</span>
          <h2 className="text-base font-bold text-slate-900">{invoice.customer?.name || 'Walk-in Customer'}</h2>
          <div className="text-xs text-slate-600 space-y-1 mt-1.5">
            {invoice.customer?.email && <p>{invoice.customer.email}</p>}
            {invoice.customer?.phone && <p>{invoice.customer.phone}</p>}
            {invoice.customer?.address && <p>{invoice.customer.address}</p>}
            {(invoice.customer?.city || invoice.customer?.state) && (
              <p>{invoice.customer.city}{invoice.customer?.state ? `, ${invoice.customer.state}` : ''} {invoice.customer?.zipCode || ''}</p>
            )}
            {invoice.customer?.taxId && <p className="font-medium text-slate-700">Tax ID / GSTIN: {invoice.customer.taxId}</p>}
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Payment Details</span>
          <div className="text-xs text-slate-600 space-y-1 sm:ml-auto max-w-xs">
            <p><span className="font-semibold text-slate-700">Bank Name:</span> HDFC Bank Ltd</p>
            <p><span className="font-semibold text-slate-700">Account No:</span> 50200084729103</p>
            <p><span className="font-semibold text-slate-700">IFSC Code:</span> HDFC0000240</p>
            <p><span className="font-semibold text-slate-700">UPI ID:</span> billflow@hdfcbank</p>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="py-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`${currentTheme.bg} text-slate-700 font-semibold border-y ${currentTheme.border}`}>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">GST Rate</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-400 font-mono">{index + 1}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{item.description}</p>
                      {item.product?.sku && (
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {item.product.sku}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 px-4 text-right font-mono">{item.gstRate || 0}%</td>
                    <td className="py-3 px-4 text-right font-bold font-mono text-slate-900">{formatCurrency(item.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">No items on this invoice</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 pb-8 border-t border-slate-200">
        <div className="max-w-sm space-y-3">
          {invoice.notes && (
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Notes & Terms:</span>
              <p className="text-slate-600 leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          <div className="text-[11px] text-slate-500 space-y-1">
            <p>1. Payment is due within 15 days of invoice date.</p>
            <p>2. Please quote invoice number {invoice.invoiceNumber} in your payment reference.</p>
          </div>
        </div>

        <div className="w-full sm:w-72 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 py-1">
            <span>Subtotal:</span>
            <span className="font-mono font-medium text-slate-800">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 py-1">
            <span>Estimated Tax (GST):</span>
            <span className="font-mono font-medium text-slate-800">{formatCurrency(invoice.tax)}</span>
          </div>
          {invoice.discount ? (
            <div className="flex justify-between text-emerald-600 py-1">
              <span>Discount:</span>
              <span className="font-mono font-medium">-{formatCurrency(invoice.discount)}</span>
            </div>
          ) : null}
          <div className={`flex justify-between items-center text-sm font-bold text-slate-900 pt-3 border-t-2 ${currentTheme.border}`}>
            <span className="text-base">Total Amount:</span>
            <span className={`text-xl font-extrabold font-mono ${currentTheme.text}`}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer & Signature */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div>
          <p className="font-medium text-slate-700">Thank you for your business!</p>
          <p className="text-[11px] text-slate-400 mt-0.5">BillFlow Invoicing System • System-generated invoice</p>
        </div>
        <div className="text-center sm:text-right">
          <div className="h-10 border-b border-slate-300 w-44 mb-1 mx-auto sm:ml-auto" />
          <p className="font-semibold text-slate-700">Authorized Signatory</p>
          <p className="text-[10px] text-slate-400">{store?.name || 'BillFlow Store'}</p>
        </div>
      </div>
    </div>
  )
}
