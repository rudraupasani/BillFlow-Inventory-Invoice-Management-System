'use client'

import React from 'react'
import { Invoice, Store } from '@/lib/types'
import { QrCode } from 'lucide-react'

interface TemplateProps {
  invoice: Invoice
  store?: Store | null
  accentColor?: string
}

export function CreativeTemplate({ invoice, store, accentColor = 'indigo' }: TemplateProps) {
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

  const colorStyles: Record<string, { gradient: string; text: string; bgSoft: string; badge: string }> = {
    indigo: {
      gradient: 'from-indigo-900 via-indigo-800 to-slate-900',
      text: 'text-indigo-600',
      bgSoft: 'bg-indigo-50/60',
      badge: 'bg-indigo-500 text-white',
    },
    emerald: {
      gradient: 'from-emerald-900 via-teal-800 to-slate-900',
      text: 'text-emerald-600',
      bgSoft: 'bg-emerald-50/60',
      badge: 'bg-emerald-500 text-white',
    },
    blue: {
      gradient: 'from-blue-900 via-sky-800 to-slate-900',
      text: 'text-blue-600',
      bgSoft: 'bg-blue-50/60',
      badge: 'bg-blue-500 text-white',
    },
    rose: {
      gradient: 'from-rose-950 via-pink-900 to-slate-900',
      text: 'text-rose-600',
      bgSoft: 'bg-rose-50/60',
      badge: 'bg-rose-500 text-white',
    },
    violet: {
      gradient: 'from-purple-950 via-violet-900 to-slate-900',
      text: 'text-violet-600',
      bgSoft: 'bg-violet-50/60',
      badge: 'bg-violet-500 text-white',
    },
    slate: {
      gradient: 'from-slate-950 via-slate-900 to-zinc-900',
      text: 'text-slate-800',
      bgSoft: 'bg-slate-100',
      badge: 'bg-slate-700 text-white',
    },
  }

  const currentTheme = colorStyles[accentColor] || colorStyles.indigo

  return (
    <div className="bg-white text-slate-800 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto font-sans border border-slate-100 print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:max-w-full">
      {/* Creative Header Banner */}
      <div className={`bg-gradient-to-r ${currentTheme.gradient} text-white p-8 sm:p-10 relative overflow-hidden`}>
        {/* Decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold mb-4 text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Invoice
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{store?.name || 'BillFlow Studio'}</h1>
            <p className="text-white/70 text-xs sm:text-sm mt-1">{store?.address || '123 Creative Hub, Innovation District'}</p>
            <p className="text-white/70 text-xs">{store?.city || 'Mumbai'}, {store?.state || 'Maharashtra'} • GSTIN: {store?.gstNumber || '27AAFCT5055K1ZO'}</p>
          </div>

          <div className="sm:text-right bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/15 sm:min-w-[200px]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">Invoice Number</span>
            <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white mt-0.5">{invoice.invoiceNumber}</p>
            <div className="mt-2 pt-2 border-t border-white/10 text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Date:</span>
                <span className="font-medium text-white">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Due:</span>
                <span className="font-medium text-white">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between gap-4 items-center pt-1">
                <span className="text-white/60">Status:</span>
                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-900">
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Container */}
      <div className="p-8 sm:p-10 space-y-8">
        {/* Bill To & Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Billed Client</span>
            <h2 className="text-base font-bold text-slate-900">{invoice.customer?.name || 'Walk-in Customer'}</h2>
            <div className="text-xs text-slate-600 mt-2 space-y-1">
              {invoice.customer?.email && <p>📧 {invoice.customer.email}</p>}
              {invoice.customer?.phone && <p>📞 {invoice.customer.phone}</p>}
              {invoice.customer?.address && <p>📍 {invoice.customer.address}, {invoice.customer.city || ''}</p>}
              {invoice.customer?.taxId && <p className="font-medium text-slate-700">Tax ID: {invoice.customer.taxId}</p>}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Total Amount Due</span>
              <p className="text-2xl font-black font-mono text-emerald-400 mt-1">{formatCurrency(invoice.total)}</p>
            </div>
            <div className="text-[11px] text-slate-300 pt-3 border-t border-slate-800">
              <p>Due on {formatDate(invoice.dueDate)}</p>
              <p className="text-slate-400 text-[10px] mt-0.5 capitalize">Payment: {invoice.paymentMethod || 'Online / Bank'}</p>
            </div>
          </div>
        </div>

        {/* Modern Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-center w-20">Quantity</th>
                <th className="py-3.5 px-4 text-right w-28">Price</th>
                <th className="py-3.5 px-4 text-right w-24">GST</th>
                <th className="py-3.5 px-4 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{item.description}</p>
                      {item.product?.sku && (
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {item.product.sku}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold font-mono">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">{item.gstRate || 0}%</td>
                    <td className="py-3.5 px-4 text-right font-bold font-mono text-slate-900">{formatCurrency(item.amount)}</td>
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

        {/* Lower Section: QR Code / Pay Info & Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          {/* QR Code and Bank info */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 items-center">
            {/* Simulated UPI QR Code */}
            <div className="w-24 h-24 bg-white p-2 rounded-lg border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
              <QrCode className="w-16 h-16 text-slate-800" />
              <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Scan & Pay</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 text-sm">Instant UPI Payment</p>
              <p className="font-mono text-[11px] text-slate-700">UPI ID: pay@billflow</p>
              <p className="text-[11px]">Bank: HDFC Bank • IFSC: HDFC0000240</p>
              <p className="text-[10px] text-slate-400">Scan QR with Google Pay, PhonePe, or Paytm</p>
            </div>
          </div>

          {/* Subtotal & Totals */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium text-slate-800">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST Tax Amount:</span>
              <span className="font-mono font-medium text-slate-800">{formatCurrency(invoice.tax)}</span>
            </div>
            {invoice.discount ? (
              <div className="flex justify-between text-emerald-600">
                <span>Discount Applied:</span>
                <span className="font-mono font-medium">-{formatCurrency(invoice.discount)}</span>
              </div>
            ) : null}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-bold">
              <span className="text-sm">Final Amount:</span>
              <span className={`text-xl font-black font-mono ${currentTheme.text}`}>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            <p className="font-medium text-slate-700">Have questions? We are here to help!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Contact us at support@billflow.com or call +91 98765 43210</p>
          </div>
          <div className="text-center sm:text-right">
            <div className="font-serif italic text-base text-slate-800 font-bold">BillFlow Team</div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Certified Digital Bill</p>
          </div>
        </div>
      </div>
    </div>
  )
}
