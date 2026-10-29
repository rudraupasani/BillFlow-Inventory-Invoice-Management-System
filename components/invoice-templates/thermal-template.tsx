'use client'

import React from 'react'
import { Invoice, Store } from '@/lib/types'

interface TemplateProps {
  invoice: Invoice
  store?: Store | null
  accentColor?: string
}

export function ThermalTemplate({ invoice, store }: TemplateProps) {
  const storeName = store?.name || 'BILLFLOW STORE'
  const storePhone = store?.phone || '+91-9876543210'
  const storeAddress = store?.address || '123 Market Street'
  const storeCity = store?.city || 'Mumbai'
  const storeGst = store?.gstNumber || '27AAFCT5055K1ZO'
  const upiId = store?.upiId || 'billflow@oksbi'

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
  }

  const formatCurrency = (amount: number | undefined) => {
    const val = amount || 0
    return `₹${val.toFixed(2)}`
  }

  const total = invoice.total || 0
  const subtotal = invoice.subtotal || 0
  const tax = invoice.tax || 0
  const discount = invoice.discount || 0
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(storeName)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill ' + invoice.invoiceNumber)}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiPayUrl)}`

  return (
    <div className="bg-white text-black p-4 font-mono text-xs max-w-[340px] mx-auto border border-gray-300 shadow-md print:shadow-none print:border-none print:p-0 print:max-w-full">
      {/* Store Header */}
      <div className="text-center space-y-0.5 pb-2">
        <h2 className="text-base font-extrabold uppercase tracking-wider">{storeName}</h2>
        <p className="text-[11px] text-gray-700">{storeAddress}, {storeCity}</p>
        <p className="text-[11px] text-gray-700">Ph: {storePhone}</p>
        {storeGst && <p className="text-[10px] font-semibold text-gray-800">GSTIN: {storeGst}</p>}
      </div>

      <div className="border-t border-dashed border-black my-2" />

      {/* Bill Meta */}
      <div className="space-y-0.5 text-[11px]">
        <div className="flex justify-between">
          <span>Bill No: <span className="font-bold">{invoice.invoiceNumber}</span></span>
          <span className="uppercase font-bold">{invoice.paymentMethod || 'CASH'}</span>
        </div>
        <div className="flex justify-between">
          <span>Date: {formatDate(invoice.issueDate || invoice.createdAt)}</span>
        </div>
        {invoice.customer?.name && (
          <div className="flex justify-between">
            <span>Customer: {invoice.customer.name}</span>
            {invoice.customer.phone && <span>{invoice.customer.phone}</span>}
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-black my-2" />

      {/* Items Table */}
      <table className="w-full text-[11px] mb-2">
        <thead>
          <tr className="border-b border-dashed border-black text-left">
            <th className="py-1">Item</th>
            <th className="py-1 text-center">Qty</th>
            <th className="py-1 text-right">Rate</th>
            <th className="py-1 text-right">Amt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoice.items.map((item, idx) => (
            <tr key={idx} className="align-top">
              <td className="py-1 pr-1">
                <div className="font-semibold">{item.description}</div>
                {item.gstRate > 0 && <span className="text-[9px] text-gray-500">GST {item.gstRate}%</span>}
              </td>
              <td className="py-1 text-center">{item.quantity}</td>
              <td className="py-1 text-right">{item.unitPrice.toFixed(2)}</td>
              <td className="py-1 text-right font-medium">{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black my-1" />

      {/* Totals */}
      <div className="space-y-0.5 text-[11px] pt-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>CGST ({(invoice.items[0]?.gstRate || 18) / 2}%):</span>
            <span>{formatCurrency(tax / 2)}</span>
          </div>
        )}
        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>SGST ({(invoice.items[0]?.gstRate || 18) / 2}%):</span>
            <span>{formatCurrency(tax / 2)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-black font-semibold">
            <span>Discount:</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="border-t border-black pt-1 my-1 flex justify-between font-black text-sm">
          <span>NET TOTAL:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2" />

      {/* Dynamic UPI QR Code */}
      <div className="text-center py-1">
        <p className="text-[10px] font-bold uppercase mb-1">Scan & Pay via UPI</p>
        <div className="inline-block p-1 bg-white border border-gray-400 rounded">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl}
            alt="UPI QR Code"
            className="w-28 h-28 mx-auto"
            loading="lazy"
          />
        </div>
        <p className="text-[9px] text-gray-600 mt-0.5">UPI ID: {upiId}</p>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-gray-700 mt-2 space-y-0.5 border-t border-dashed border-black pt-2">
        <p className="font-bold">Thank you for visiting!</p>
        <p>Goods once sold cannot be returned.</p>
        <p className="text-[8px] text-gray-400">Powered by BillFlow POS</p>
      </div>
    </div>
  )
}
