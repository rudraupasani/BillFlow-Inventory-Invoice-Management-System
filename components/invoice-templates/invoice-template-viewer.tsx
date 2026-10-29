'use client'

import React, { useState, useEffect } from 'react'
import { Invoice, Store, StoreSettings } from '@/lib/types'
import { ModernTemplate } from './modern-template'
import { ClassicTemplate } from './classic-template'
import { CreativeTemplate } from './creative-template'
import { ThermalTemplate } from './thermal-template'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Printer,
  Download,
  Check,
  Sparkles,
  Briefcase,
  FileText,
  Palette,
  Bookmark,
  Share2,
  Receipt,
  MessageCircle,
  Mail,
  QrCode,
} from 'lucide-react'

type TemplateKey = 'modern' | 'classic' | 'creative' | 'thermal'
type ColorKey = 'indigo' | 'emerald' | 'blue' | 'rose' | 'violet' | 'slate'

interface Props {
  invoice: Invoice
  store?: Store | null
  initialSettings?: StoreSettings | null
}

export function InvoiceTemplateViewer({ invoice, store, initialSettings }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('modern')
  const [accentColor, setAccentColor] = useState<ColorKey>('indigo')
  const [isSavingDefault, setIsSavingDefault] = useState(false)
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false)

  // Load saved default preference from settings or localStorage
  useEffect(() => {
    const savedTemplate = localStorage.getItem('billflow_default_template') as TemplateKey | null
    const savedColor = localStorage.getItem('billflow_template_color') as ColorKey | null

    if (savedTemplate && ['modern', 'classic', 'creative'].includes(savedTemplate)) {
      setSelectedTemplate(savedTemplate)
    } else if (initialSettings?.invoiceTemplate && ['modern', 'classic', 'creative'].includes(initialSettings.invoiceTemplate)) {
      setSelectedTemplate(initialSettings.invoiceTemplate as TemplateKey)
    }

    if (savedColor && ['indigo', 'emerald', 'blue', 'rose', 'violet', 'slate'].includes(savedColor)) {
      setAccentColor(savedColor)
    }
  }, [initialSettings])

  // Save current template as default
  const handleSetAsDefault = async () => {
    setIsSavingDefault(true)
    try {
      localStorage.setItem('billflow_default_template', selectedTemplate)
      localStorage.setItem('billflow_template_color', accentColor)

      // Also persist to store settings API if available
      if (initialSettings?.id) {
        await fetch(`/api/store/settings?id=${initialSettings.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceTemplate: selectedTemplate,
            templateColor: accentColor,
          }),
        })
      }

      toast.success(`Template "${selectedTemplate.toUpperCase()}" set as your default!`)
    } catch (err) {
      console.error(err)
      toast.success(`Template set as default locally!`)
    } finally {
      setIsSavingDefault(false)
    }
  }

  // Native Print / Save to PDF
  const handlePrint = () => {
    window.print()
  }

  // Download Invoice as PDF
  const handleDownloadInvoice = async () => {
    const printableArea = document.getElementById('invoice-printable-container')
    if (!printableArea) {
      window.print()
      return
    }

    const toastId = toast.loading('Generating PDF...')

    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')

      const canvas = await html2canvas(printableArea, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const scaledWidth = imgWidth * ratio
      const scaledHeight = imgHeight * ratio
      const xOffset = (pdfWidth - scaledWidth) / 2

      // Handle multi-page PDFs if invoice is tall
      let yPosition = 0
      while (yPosition < scaledHeight) {
        if (yPosition > 0) pdf.addPage()
        pdf.addImage(
          imgData,
          'PNG',
          xOffset,
          -yPosition,
          scaledWidth,
          scaledHeight
        )
        yPosition += pdfHeight
      }

      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`)
      toast.success(`Invoice ${invoice.invoiceNumber} downloaded as PDF!`, { id: toastId })
    } catch (err) {
      console.error('PDF generation failed:', err)
      toast.error('PDF generation failed. Using print dialog instead.', { id: toastId })
      window.print()
    }
  }

  // 1-Click WhatsApp Sharing
  const handleShareWhatsApp = () => {
    const rawPhone = invoice.customer?.phone || ''
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '')
    const itemsSummary = invoice.items
      .map((item) => `• ${item.description} (x${item.quantity}) - ₹${(item.unitPrice * item.quantity).toFixed(2)}`)
      .join('\n')

    const message = `🧾 *INVOICE: ${invoice.invoiceNumber}*
Store: *${store?.name || 'BillFlow'}*
Date: ${new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}
Customer: ${invoice.customer?.name || 'Valued Customer'}

*Items:*
${itemsSummary}

*Subtotal:* ₹${(invoice.subtotal || 0).toFixed(2)}
*Tax:* ₹${(invoice.tax || 0).toFixed(2)}
*Total Amount:* ₹${(invoice.total || 0).toFixed(2)}
*Status:* ${(invoice.status || 'Paid').toUpperCase()}

Thank you for your business!`

    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(url, '_blank')
    toast.success('Opening WhatsApp...')
  }

  // 1-Click Email Sharing
  const handleEmailInvoice = () => {
    const email = invoice.customer?.email || ''
    const subject = `Invoice ${invoice.invoiceNumber} from ${store?.name || 'BillFlow'}`
    const body = `Dear ${invoice.customer?.name || 'Customer'},

Please find the summary for your invoice ${invoice.invoiceNumber} below:

Invoice Number: ${invoice.invoiceNumber}
Issue Date: ${new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}
Total Amount: ₹${(invoice.total || 0).toFixed(2)}
Status: ${(invoice.status || 'Paid').toUpperCase()}

Thank you for choosing ${store?.name || 'BillFlow'}.

Best regards,
${store?.name || 'BillFlow Team'}`

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    toast.success('Opening Email client...')
  }

  const upiId = store?.upiId || 'billflow@oksbi'
  const storeName = store?.name || 'BillFlow'
  const totalAmount = (invoice.total || 0).toFixed(2)
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(storeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Invoice ' + invoice.invoiceNumber)}`
  const upiQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiPayUrl)}`

  const templates = [
    {
      id: 'modern' as TemplateKey,
      name: 'Modern Clean',
      description: 'Sleek, minimalist aesthetic with crisp borders & subtle accent bar',
      icon: Sparkles,
    },
    {
      id: 'classic' as TemplateKey,
      name: 'Classic Corporate',
      description: 'Formal GST tax invoice layout with structured tables & amount in words',
      icon: Briefcase,
    },
    {
      id: 'creative' as TemplateKey,
      name: 'Creative Studio',
      description: 'Bold vibrant banner, floating cards & scan-and-pay UPI QR code',
      icon: FileText,
    },
    {
      id: 'thermal' as TemplateKey,
      name: 'Thermal 80mm',
      description: 'Compact roll receipt format with itemized summary & scannable UPI QR',
      icon: Receipt,
    },
  ]

  const colorOptions: { id: ColorKey; label: string; bg: string }[] = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { id: 'blue', label: 'Ocean Blue', bg: 'bg-blue-600' },
    { id: 'rose', label: 'Rose Pink', bg: 'bg-rose-600' },
    { id: 'violet', label: 'Purple Violet', bg: 'bg-violet-600' },
    { id: 'slate', label: 'Dark Slate', bg: 'bg-slate-800' },
  ]

  return (
    <div className="space-y-6">
      {/* Interactive Template Selector & Control Toolbar - Hidden in Print */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Invoice Template & Actions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select your preferred invoice style, share via WhatsApp/Email, or print
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareWhatsApp}
              className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 cursor-pointer"
              title="Share invoice summary directly to customer on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailInvoice}
              className="gap-1.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 cursor-pointer"
              title="Send invoice details to customer email"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpiModalOpen(true)}
              className="gap-1.5 text-xs text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-400 cursor-pointer"
              title="Display UPI Payment QR code for instant scanning"
            >
              <QrCode className="w-3.5 h-3.5" />
              UPI QR
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSetAsDefault}
              disabled={isSavingDefault}
              className="gap-1.5 text-xs cursor-pointer"
              title="Save this template as your default for all invoices"
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isSavingDefault ? 'Saving...' : 'Set as Default'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs cursor-pointer"
              title="Print or Save to PDF via Browser"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </Button>

            <Button
              size="sm"
              onClick={handleDownloadInvoice}
              className="gap-1.5 text-xs bg-primary hover:bg-primary/90 text-white cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* 4 Template Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl) => {
            const Icon = tpl.icon
            const isSelected = selectedTemplate === tpl.id

            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-3.5 rounded-lg text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 text-foreground'
                    : 'border-border hover:border-border hover:bg-secondary/40 text-muted-foreground'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{tpl.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {tpl.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Color Palette Selector (for templates with accents) */}
        {selectedTemplate !== 'classic' && selectedTemplate !== 'thermal' && (
          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="font-medium text-muted-foreground">Accent Color:</span>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAccentColor(c.id)}
                  title={c.label}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-transform cursor-pointer ${
                    accentColor === c.id ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold uppercase text-foreground ml-1">
              {accentColor}
            </span>
          </div>
        )}
      </div>

      {/* Live Invoice Preview / Printable Area */}
      <div id="invoice-printable-container" className="print:m-0 print:p-0">
        {selectedTemplate === 'modern' && (
          <ModernTemplate invoice={invoice} store={store} accentColor={accentColor} />
        )}
        {selectedTemplate === 'classic' && (
          <ClassicTemplate invoice={invoice} store={store} accentColor={accentColor} />
        )}
        {selectedTemplate === 'creative' && (
          <CreativeTemplate invoice={invoice} store={store} accentColor={accentColor} />
        )}
        {selectedTemplate === 'thermal' && (
          <ThermalTemplate invoice={invoice} store={store} accentColor={accentColor} />
        )}
      </div>

      {/* UPI Payment Modal Dialog */}
      <Dialog open={isUpiModalOpen} onOpenChange={setIsUpiModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">Scan & Pay via UPI</DialogTitle>
            <DialogDescription className="text-center text-xs">
              Scan with Google Pay, PhonePe, Paytm, or any UPI app
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <div className="p-3 bg-white border-2 border-primary/20 rounded-xl shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upiQrImg}
                alt="UPI Payment QR Code"
                className="w-56 h-56 mx-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-foreground">₹{totalAmount}</p>
              <p className="text-xs text-muted-foreground">UPI VPA: <span className="font-semibold text-foreground">{upiId}</span></p>
              <p className="text-[11px] text-muted-foreground">Ref: {invoice.invoiceNumber}</p>
            </div>
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(upiPayUrl)
                toast.success('UPI Payment Link copied!')
              }}
            >
              Copy UPI Payment Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
