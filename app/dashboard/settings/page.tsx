'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Store, StoreSettings } from '@/lib/types'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

export default function SettingsPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [storeRes, settingsRes] = await Promise.all([
        fetch('/api/store?id=store-1'),
        fetch('/api/store/settings?storeId=store-1'),
      ])

      if (storeRes.ok) setStore(await storeRes.json())
      if (settingsRes.ok) setSettings(await settingsRes.json())
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStoreChange = (field: keyof Store, value: any) => {
    if (store) {
      setStore({ ...store, [field]: value })
    }
  }

  const handleSettingsChange = (field: keyof StoreSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value })
    }
  }

  const saveStore = async () => {
    if (!store) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/store?id=${store.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store),
      })

      if (res.ok) {
        toast.success('Store information updated')
      } else {
        toast.error('Failed to update store')
      }
    } catch (error) {
      toast.error('Error updating store')
    } finally {
      setIsSaving(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/store/settings?id=${settings.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success('Settings updated')
      } else {
        toast.error('Failed to update settings')
      }
    } catch (error) {
      toast.error('Error updating settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading settings...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure your store and system settings
        </p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList>
          <TabsTrigger value="store">Store Information</TabsTrigger>
          <TabsTrigger value="invoice">Invoice & Billing</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Store Information Tab */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="storeName">Store Name</FieldLabel>
                  <Input
                    id="storeName"
                    value={store?.name || ''}
                    onChange={(e) => handleStoreChange('name', e.target.value)}
                    placeholder="My Awesome Store"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="gstNumber">GST Number</FieldLabel>
                  <Input
                    id="gstNumber"
                    value={store?.gstNumber || ''}
                    onChange={(e) => handleStoreChange('gstNumber', e.target.value)}
                    placeholder="27AAFCT5055K1ZO"
                  />
                </Field>
              </FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={store?.email || ''}
                      onChange={(e) => handleStoreChange('email', e.target.value)}
                      placeholder="store@example.com"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      id="phone"
                      value={store?.phone || ''}
                      onChange={(e) => handleStoreChange('phone', e.target.value)}
                      placeholder="+91-9876543210"
                    />
                  </Field>
                </FieldGroup>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    id="address"
                    value={store?.address || ''}
                    onChange={(e) => handleStoreChange('address', e.target.value)}
                    placeholder="123 Business Street"
                  />
                </Field>
              </FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      value={store?.city || ''}
                      onChange={(e) => handleStoreChange('city', e.target.value)}
                      placeholder="Mumbai"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <Input
                      id="state"
                      value={store?.state || ''}
                      onChange={(e) => handleStoreChange('state', e.target.value)}
                      placeholder="Maharashtra"
                    />
                  </Field>
                </FieldGroup>
              </div>

              <Button onClick={saveStore} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save Store Information'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice & Billing Tab */}
        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice & Billing Settings</CardTitle>
              <CardDescription>
                Configure invoice and bill generation options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="invoicePrefix">Invoice Prefix</FieldLabel>
                    <Input
                      id="invoicePrefix"
                      value={settings?.invoicePrefix || ''}
                      onChange={(e) => handleSettingsChange('invoicePrefix', e.target.value)}
                      placeholder="INV"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="billPrefix">Bill Prefix</FieldLabel>
                    <Input
                      id="billPrefix"
                      value={settings?.billPrefix || ''}
                      onChange={(e) => handleSettingsChange('billPrefix', e.target.value)}
                      placeholder="BILL"
                    />
                  </Field>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="invoiceFormat">Invoice Format</FieldLabel>
                    <Select 
                      value={settings?.invoiceFormat || 'detailed'}
                      onValueChange={(value) => handleSettingsChange('invoiceFormat', value)}
                    >
                      <SelectTrigger id="invoiceFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="billFormat">Bill Format</FieldLabel>
                    <Select 
                      value={settings?.billFormat || 'thermal'}
                      onValueChange={(value) => handleSettingsChange('billFormat', value)}
                    >
                      <SelectTrigger id="billFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thermal">Thermal (58mm)</SelectItem>
                        <SelectItem value="a4">A4</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </div>

              {/* Default Invoice Template */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="invoiceTemplate">Default Invoice Template</FieldLabel>
                    <Select 
                      value={settings?.invoiceTemplate || 'modern'}
                      onValueChange={(value) => {
                        handleSettingsChange('invoiceTemplate', value)
                        localStorage.setItem('billflow_default_template', value)
                      }}
                    >
                      <SelectTrigger id="invoiceTemplate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">🎨 Modern Minimalist (Clean & Elegant)</SelectItem>
                        <SelectItem value="classic">🏢 Classic Corporate (Formal GST Layout)</SelectItem>
                        <SelectItem value="creative">✨ Creative Studio (Bold with UPI QR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="templateColor">Template Accent Color</FieldLabel>
                    <Select 
                      value={settings?.templateColor || 'indigo'}
                      onValueChange={(value) => {
                        handleSettingsChange('templateColor', value)
                        localStorage.setItem('billflow_template_color', value)
                      }}
                    >
                      <SelectTrigger id="templateColor">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indigo">Indigo Blue</SelectItem>
                        <SelectItem value="emerald">Emerald Green</SelectItem>
                        <SelectItem value="blue">Ocean Blue</SelectItem>
                        <SelectItem value="rose">Rose Pink</SelectItem>
                        <SelectItem value="violet">Purple Violet</SelectItem>
                        <SelectItem value="slate">Dark Slate</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </div>

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable GST</p>
                    <p className="text-sm text-muted-foreground">Apply GST to all invoices and bills</p>
                  </div>
                  <Switch
                    checked={settings?.enableGST || false}
                    onCheckedChange={(checked) => handleSettingsChange('enableGST', checked)}
                  />
                </div>

                {settings?.enableGST && (
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="defaultGST">Default GST Rate (%)</FieldLabel>
                      <Input
                        id="defaultGST"
                        type="number"
                        value={settings?.defaultGSTRate || 18}
                        onChange={(e) => handleSettingsChange('defaultGSTRate', parseFloat(e.target.value))}
                        placeholder="18"
                        min="0"
                        max="100"
                      />
                    </Field>
                  </FieldGroup>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Barcode</p>
                    <p className="text-sm text-muted-foreground">Support barcode scanning for products</p>
                  </div>
                  <Switch
                    checked={settings?.enableBarcode || false}
                    onCheckedChange={(checked) => handleSettingsChange('enableBarcode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Barcode Labels</p>
                    <p className="text-sm text-muted-foreground">Print barcode labels for inventory</p>
                  </div>
                  <Switch
                    checked={settings?.enableBarcodeLabel || false}
                    onCheckedChange={(checked) => handleSettingsChange('enableBarcodeLabel', checked)}
                  />
                </div>
              </div>

              <Button onClick={saveSettings} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save Invoice Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="currency">Currency Code</FieldLabel>
                    <Input
                      id="currency"
                      value={settings?.currencyCode || 'INR'}
                      onChange={(e) => handleSettingsChange('currencyCode', e.target.value)}
                      placeholder="INR"
                      maxLength={3}
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="symbol">Currency Symbol</FieldLabel>
                    <Input
                      id="symbol"
                      value={settings?.currencySymbol || '₹'}
                      onChange={(e) => handleSettingsChange('currencySymbol', e.target.value)}
                      placeholder="₹"
                      maxLength={5}
                    />
                  </Field>
                </FieldGroup>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="theme">Theme</FieldLabel>
                  <Select 
                    value={settings?.theme || 'dark'}
                    onValueChange={(value) => handleSettingsChange('theme', value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Credit Notes</p>
                    <p className="text-sm text-muted-foreground">Allow creation of credit notes</p>
                  </div>
                  <Switch
                    checked={settings?.enableCreditNotes || false}
                    onCheckedChange={(checked) => handleSettingsChange('enableCreditNotes', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Recurring Invoices</p>
                    <p className="text-sm text-muted-foreground">Allow recurring invoice schedules</p>
                  </div>
                  <Switch
                    checked={settings?.enableRecurringInvoices || false}
                    onCheckedChange={(checked) => handleSettingsChange('enableRecurringInvoices', checked)}
                  />
                </div>
              </div>

              <Button onClick={saveSettings} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save System Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
