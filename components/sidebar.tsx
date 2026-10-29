'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  LogOut,
  BarChart3,
  ShoppingCart,
  Settings,
  Boxes,
  Lock,
  Crown,
  ShieldAlert,
  Briefcase,
  Receipt,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user, hasPermission, userRole } = useAuth()

  // All possible navigation items mapped to their authorization module
  const allNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { href: '/dashboard/pos', label: 'POS Terminal', icon: ShoppingCart, module: 'pos' },
    { href: '/dashboard/invoices', label: 'Invoices & Bills', icon: FileText, module: 'invoices' },
    { href: '/dashboard/products', label: 'Products Catalog', icon: Package, module: 'products' },
    { href: '/dashboard/inventory', label: 'Inventory & Stock', icon: Boxes, module: 'inventory' },
    { href: '/dashboard/customers', label: 'Customers & Khata', icon: Users, module: 'customers' },
    { href: '/dashboard/reports', label: 'Reports & P&L', icon: BarChart3, module: 'reports' },
    { href: '/dashboard/settings', label: 'Store Settings', icon: Settings, module: 'settings' },
    { href: '/dashboard/users', label: 'Staff & Roles', icon: Lock, module: 'users' },
  ]

  // Filter navigation items strictly based on role permissions (hasPermission read)
  const allowedNavItems = allNavItems.filter((item) => hasPermission(item.module, 'read'))

  // Role visual configuration
  const roleConfig = {
    owner: {
      label: 'Owner',
      icon: Crown,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200',
    },
    admin: {
      label: 'Admin',
      icon: ShieldAlert,
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200',
    },
    manager: {
      label: 'Manager',
      icon: Briefcase,
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200',
    },
    staff: {
      label: 'Staff / POS',
      icon: Receipt,
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200',
    },
  }

  const currentRole = userRole ? roleConfig[userRole] : roleConfig.staff
  const RoleIcon = currentRole.icon

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 shrink-0 print:hidden z-20 shadow-xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-extrabold text-foreground tracking-tight block">
              Bill<span className="text-primary">Flow</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block -mt-0.5">
              Retail ERP
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation (Strictly Filtered by Role) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Navigation ({allowedNavItems.length} modules)
        </div>

        {allowedNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.module === 'pos' && !isActive && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/30 text-primary">
                    Live
                  </Badge>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Profile & Current Role Indicator */}
      <div className="p-3 border-t border-border bg-muted/20 shrink-0 space-y-2.5">
        <div className="p-2.5 bg-card border border-border rounded-xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Role</span>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 ${currentRole.badgeClass}`}
            >
              <RoleIcon className="w-3 h-3" />
              <span>{currentRole.label}</span>
            </Badge>
          </div>
          <div className="pt-1">
            <p className="text-xs font-bold text-foreground truncate">{user?.name || 'Authorized User'}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full h-8 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  )
}
