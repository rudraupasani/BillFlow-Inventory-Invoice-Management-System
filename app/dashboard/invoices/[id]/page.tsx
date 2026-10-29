'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Invoice, Store, StoreSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { InvoiceTemplateViewer } from '@/components/invoice-templates/invoice-template-viewer'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, storeRes, settingsRes] = await Promise.all([
          fetch(`/api/invoices/${id}`),
          fetch('/api/store?id=store-1'),
          fetch('/api/store/settings?storeId=store-1'),
        ])

        if (invoiceRes.ok) {
          const invoiceData = await invoiceRes.json()
          setInvoice(invoiceData)
        }
        if (storeRes.ok) {
          const storeData = await storeRes.json()
          setStore(storeData)
        }
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('Failed to fetch invoice details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading invoice and templates...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold">Invoice Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested invoice ID &quot;{id}&quot; does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/dashboard/invoices">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back button & Title (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Invoices
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-muted-foreground">
              Created on {new Date(invoice.issueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Template Viewer with 3 selectable templates and download functionality */}
      <InvoiceTemplateViewer
        invoice={invoice}
        store={store}
        initialSettings={settings}
      />
    </div>
  )
}
