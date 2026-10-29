'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { ShieldAlert, ArrowLeft, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, hasPermission, userRole, switchRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Verifying security session & permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Derive module name from route pathname
  const segments = pathname.replace('/dashboard', '').replace(/^\//, '').split('/')
  const currentModule = segments[0] || 'dashboard'

  // Map known modules
  const knownModules = ['dashboard', 'pos', 'invoices', 'products', 'inventory', 'customers', 'reports', 'settings', 'users']
  const isProtectedModule = knownModules.includes(currentModule)
  const isAllowed = isProtectedModule ? hasPermission(currentModule, 'read') : true

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />
        <main className="flex-1 min-h-0 pb-16">
          {!isAllowed ? (
            /* Role-Based Access Denied Fallback Screen */
            <div className="p-8 max-w-lg mx-auto my-12 text-center bg-card border border-border rounded-2xl shadow-sm space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive px-2 py-0.5 bg-destructive/10 rounded-full">
                  403 Forbidden Access
                </span>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Access Restricted
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your current role (<span className="font-bold text-foreground uppercase">{userRole}</span>) does not have permission to view or manage the <span className="font-semibold text-foreground uppercase">{currentModule}</span> module.
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-xl text-xs text-muted-foreground space-y-1 text-left">
                <p className="font-semibold text-foreground">Role Restrictions for &quot;{userRole}&quot;:</p>
                <p>• Staff / Cashiers can access: POS Terminal, Invoices, Customers, and Products.</p>
                <p>• Staff cannot access: Reports, Users management, or Store settings.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Button asChild size="sm" variant="default" className="w-full sm:w-auto text-xs bg-primary text-white">
                  <Link href="/dashboard/pos">
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Return to POS Terminal
                  </Link>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => switchRole('owner')}
                  className="w-full sm:w-auto text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Switch to Owner Role</span>
                </Button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
