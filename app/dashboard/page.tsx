'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { DashboardMetrics } from '@/lib/types'
import { DollarSign, FileText, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <div className="text-sm text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: metrics?.totalRevenue ? `₹${metrics.totalRevenue.toLocaleString()}` : '₹0',
      icon: DollarSign,
      description: 'Paid invoices total',
    },
    {
      title: "Today's Sales",
      value: metrics?.todayRevenue ? `₹${metrics.todayRevenue.toLocaleString()}` : '₹0',
      icon: TrendingUp,
      description: `${metrics?.billsToday || 0} bills created`,
    },
    {
      title: 'Total Bills',
      value: metrics?.totalBills || 0,
      icon: ShoppingCart,
      description: 'POS transactions',
    },
    {
      title: 'Total Invoices',
      value: metrics?.totalInvoices || 0,
      icon: FileText,
      description: `${metrics?.paidInvoices || 0} paid`,
    },
    {
      title: 'Total Products',
      value: metrics?.totalProducts || 0,
      icon: Package,
      description: `${metrics?.lowStockProducts || 0} low stock`,
    },
    {
      title: 'Total Customers',
      value: metrics?.totalCustomers || 0,
      icon: Users,
      description: 'Active customers',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back! Here&apos;s your business overview.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* POS Quick Access */}
      <div className="flex items-center justify-between p-5 bg-primary/5 border border-primary/20 rounded-lg">
        <div>
          <h2 className="text-base font-semibold mb-0.5">Ready to Create a Sale?</h2>
          <p className="text-sm text-muted-foreground">Start processing bills instantly with the POS system</p>
        </div>
        <Link href="/dashboard/pos">
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Go to POS
          </Button>
        </Link>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alerts Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics?.unpaidInvoices === 0 && metrics?.lowStockProducts === 0 ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    Everything looks great! All invoices paid and inventory well-stocked.
                  </p>
                </div>
              ) : (
                <>
                  {metrics?.unpaidInvoices ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">
                        {metrics?.unpaidInvoices} unpaid invoice{metrics?.unpaidInvoices !== 1 ? 's' : ''} awaiting payment
                      </p>
                    </div>
                  ) : null}
                  {metrics?.lowStockProducts ? (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <p className="text-sm font-medium text-orange-800">
                        {metrics?.lowStockProducts} product{metrics?.lowStockProducts !== 1 ? 's' : ''} with low inventory
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Total Invoices</p>
              <p className="text-2xl font-bold">{metrics?.totalInvoices || 0}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-0.5">Paid Rate</p>
              <p className="text-2xl font-bold">
                {metrics?.totalInvoices ? Math.round((((metrics?.paidInvoices || 0) / metrics.totalInvoices) * 100)) : 0}%
              </p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-0.5">Active Customers</p>
              <p className="text-2xl font-bold">{metrics?.totalCustomers || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
