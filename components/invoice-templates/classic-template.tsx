'use client'

import React from 'react'
import { Invoice, Store } from '@/lib/types'

interface TemplateProps {
  invoice: Invoice
  store?: Store | null
  accentColor?: string
}

// Helper to convert number to words
function numberToWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
    'Seventeen ', 'Eighteen ', 'Nineteen '
  ]
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const n = Math.floor(num)
  if (n === 0) return 'Zero Rupees Only'
  
  function inWords(num: number): string {
    if (num < 20) return a[num]
    const digit = num % 10
    if (num < 100) return b[Math.floor(num / 10)] + (digit ? '-' + a[digit] : ' ')
    if (num < 1000) return a[Math.floor(num / 100)] + 'Hundred ' + (num % 100 === 0 ? '' : 'and ' + inWords(num % 100))
    if (num < 100000) return inWords(Math.floor(num / 1000)) + 'Thousand ' + (num % 1000 !== 0 ? inWords(num % 1000) : '')
    if (num < 10000000) return inWords(Math.floor(num / 100000)) + 'Lakh ' + (num % 100000 !== 0 ? inWords(num % 100000) : '')
    return inWords(Math.floor(num / 10000000)) + 'Crore ' + (num % 10000000 !== 0 ? inWords(num % 10000000) : '')
  }

  return (inWords(n).trim() + ' Rupees Only').replace(/\s+/g, ' ')
}

export function ClassicTemplate({ invoice, store }: TemplateProps) {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number | undefined) => {
    const val = amount || 0
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const halfTax = (invoice.tax || 0) / 2

  return (
    <div className="bg-white text-gray-900 p-8 sm:p-10 border-2 border-gray-900 rounded-none shadow-md max-w-4xl mx-auto font-serif print:shadow-none print:border print:border-gray-900 print:p-0 print:m-0 print:max-w-full">
      {/* Top Banner */}
      <div className="text-center border-b-2 border-gray-900 pb-3 mb-4">
        <h1 className="text-xl font-bold tracking-widest uppercase">TAX INVOICE</h1>
        <p className="text-[11px] text-gray-600 font-sans">(Issued under Section 31 of Central Goods and Services Tax Act, 2017)</p>
      </div>

      {/* Supplier & Invoice Header */}
      <div className="grid grid-cols-2 border border-gray-900 mb-4 font-sans text-xs">
        <div className="p-3 border-r border-gray-900">
          <p className="font-bold text-sm uppercase text-gray-950 font-serif">{store?.name || 'BILLFLOW ENTERPRISES'}</p>
          <p className="text-gray-700 mt-1">{store?.address || '123 Business Boulevard, Commercial Complex'}</p>
          <p className="text-gray-700">{store?.city || 'Mumbai'}, {store?.state || 'Maharashtra'} - {store?.zipCode || '400001'}</p>
          <p className="mt-1"><span className="font-semibold">GSTIN:</span> {store?.gstNumber || '27AAFCT5055K1ZO'}</p>
          <p><span className="font-semibold">State / Code:</span> {store?.state || 'Maharashtra'} / 27</p>
          <p><span className="font-semibold">Email:</span> {store?.email || 'accounts@billflow.com'}</p>
          <p><span className="font-semibold">Phone:</span> {store?.phone || '+91 98765 43210'}</p>
        </div>

        <div className="p-3 space-y-1.5 bg-gray-50/50">
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-bold">Invoice No:</span>
            <span className="font-mono font-bold text-gray-950">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-semibold text-gray-700">Invoice Date:</span>
            <span className="font-mono">{formatDate(invoice.issueDate)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-semibold text-gray-700">Due Date:</span>
            <span className="font-mono">{formatDate(invoice.dueDate)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-semibold text-gray-700">Place of Supply:</span>
            <span>{store?.state || 'Maharashtra'} (27)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Payment Status:</span>
            <span className="uppercase font-bold text-xs">{invoice.status}</span>
          </div>
        </div>
      </div>

      {/* Bill To & Ship To Boxes */}
      <div className="grid grid-cols-2 border border-gray-900 mb-4 font-sans text-xs">
        <div className="p-3 border-r border-gray-900">
          <p className="font-bold text-xs uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-1.5 font-serif">
            Details of Receiver (Billed To)
          </p>
          <p className="font-bold text-sm text-gray-950">{invoice.customer?.name || 'Walk-in Customer'}</p>
          <p className="text-gray-700 mt-1">{invoice.customer?.address || 'Customer Street Address'}</p>
          <p className="text-gray-700">{invoice.customer?.city || 'City'}, {invoice.customer?.state || 'State'} - {invoice.customer?.zipCode || '000000'}</p>
          <p className="mt-1"><span className="font-semibold">GSTIN / Tax ID:</span> {invoice.customer?.taxId || 'URP (Unregistered)'}</p>
          <p><span className="font-semibold">Phone:</span> {invoice.customer?.phone || 'N/A'}</p>
          <p><span className="font-semibold">Email:</span> {invoice.customer?.email || 'N/A'}</p>
        </div>

        <div className="p-3">
          <p className="font-bold text-xs uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-1.5 font-serif">
            Details of Consignee (Shipped To)
          </p>
          <p className="font-bold text-sm text-gray-950">{invoice.customer?.name || 'Walk-in Customer'}</p>
          <p className="text-gray-700 mt-1">{invoice.customer?.address || 'Same as Billing Address'}</p>
          <p className="text-gray-700">{invoice.customer?.city || 'City'}, {invoice.customer?.state || 'State'}</p>
          <p className="mt-2 text-gray-600 italic">Dispatched via Road Transport / Local Delivery</p>
        </div>
      </div>

      {/* Item Table */}
      <div className="border border-gray-900 mb-4 overflow-x-auto font-sans text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-900">
              <th className="p-2 border-r border-gray-900 w-10 text-center">S.N.</th>
              <th className="p-2 border-r border-gray-900 text-left">Description of Goods / Services</th>
              <th className="p-2 border-r border-gray-900 text-center w-20">HSN/SAC</th>
              <th className="p-2 border-r border-gray-900 text-center w-16">Qty</th>
              <th className="p-2 border-r border-gray-900 text-right w-24">Rate (₹)</th>
              <th className="p-2 border-r border-gray-900 text-center w-16">GST %</th>
              <th className="p-2 text-right w-28">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-2 border-r border-gray-900 text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-gray-900 font-medium">{item.description}</td>
                  <td className="p-2 border-r border-gray-900 text-center font-mono">{item.product?.hsn || '998311'}</td>
                  <td className="p-2 border-r border-gray-900 text-center font-mono">{item.quantity}</td>
                  <td className="p-2 border-r border-gray-900 text-right font-mono">{formatCurrency(item.unitPrice).replace('₹', '')}</td>
                  <td className="p-2 border-r border-gray-900 text-center font-mono">{item.gstRate || 0}%</td>
                  <td className="p-2 text-right font-mono font-semibold">{formatCurrency(item.amount).replace('₹', '')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">No items available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tax Breakdown & Totals */}
      <div className="grid grid-cols-2 border border-gray-900 mb-4 font-sans text-xs">
        <div className="p-3 border-r border-gray-900 flex flex-col justify-between">
          <div>
            <p className="font-bold text-gray-900 font-serif mb-1">Invoice Amount in Words:</p>
            <p className="text-gray-800 font-medium italic bg-gray-50 p-2 border border-gray-200">
              {numberToWords(invoice.total)}
            </p>
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="font-bold text-gray-900 font-serif mb-1">Bank Payment Details:</p>
            <p><span className="font-semibold">Bank Name:</span> State Bank of India</p>
            <p><span className="font-semibold">A/C Holder:</span> {store?.name || 'BillFlow Enterprises'}</p>
            <p><span className="font-semibold">Current A/C No:</span> 38472910582</p>
            <p><span className="font-semibold">RTGS/NEFT IFSC:</span> SBIN0001234</p>
          </div>
        </div>

        <div className="divide-y divide-gray-300">
          <div className="p-2 flex justify-between">
            <span className="text-gray-700">Taxable Value (Subtotal):</span>
            <span className="font-mono font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="p-2 flex justify-between">
            <span className="text-gray-700">Central Tax (CGST @ 9%):</span>
            <span className="font-mono font-medium">{formatCurrency(halfTax)}</span>
          </div>
          <div className="p-2 flex justify-between">
            <span className="text-gray-700">State Tax (SGST @ 9%):</span>
            <span className="font-mono font-medium">{formatCurrency(halfTax)}</span>
          </div>
          {invoice.discount ? (
            <div className="p-2 flex justify-between text-gray-700">
              <span>Less: Trade Discount:</span>
              <span className="font-mono font-medium">-{formatCurrency(invoice.discount)}</span>
            </div>
          ) : null}
          <div className="p-3 flex justify-between items-center bg-gray-100 font-bold text-sm border-t-2 border-gray-900 font-serif">
            <span>Total Invoice Value:</span>
            <span className="text-base font-mono">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Signature */}
      <div className="grid grid-cols-2 border border-gray-900 font-sans text-xs">
        <div className="p-3 border-r border-gray-900">
          <p className="font-bold text-gray-900 font-serif mb-1">Terms & Conditions:</p>
          <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-gray-600">
            <li>Goods once sold will not be taken back or exchanged.</li>
            <li>Interest @ 18% p.a. will be charged if payment is delayed beyond due date.</li>
            <li>All disputes are subject to local court jurisdiction only.</li>
          </ol>
        </div>

        <div className="p-3 flex flex-col justify-between text-right">
          <p className="font-bold text-gray-900 font-serif">For {store?.name?.toUpperCase() || 'BILLFLOW ENTERPRISES'}</p>
          <div className="pt-8">
            <div className="h-8 border-b border-gray-400 w-44 ml-auto mb-1" />
            <p className="font-semibold text-gray-900 font-serif">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  )
}
