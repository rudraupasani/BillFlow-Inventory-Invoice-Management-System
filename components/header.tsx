'use client'

import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Crown,
  ShieldAlert,
  Briefcase,
  Receipt,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function Header() {
  const { user, userRole, logout, switchRole, hasPermission } = useAuth()

  const rolesList: { id: UserRole; label: string; icon: any; desc: string }[] = [
    { id: 'owner', label: 'Owner', icon: Crown, desc: 'Full System Access' },
    { id: 'admin', label: 'Admin', icon: ShieldAlert, desc: 'All Except Delete System' },
    { id: 'manager', label: 'Manager', icon: Briefcase, desc: 'Ops & Inventory, No Users' },
    { id: 'staff', label: 'Staff / Cashier', icon: Receipt, desc: 'POS & Billing Only' },
  ]

  const currentRoleObj = rolesList.find((r) => r.id === userRole) || rolesList[0]
  const CurrentRoleIcon = currentRoleObj.icon

  return (
    <header className="h-14 border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-30 flex items-center px-6 gap-4 shrink-0 print:hidden">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions, customers, products..."
            className="pl-8 h-8 bg-muted/50 border-border text-xs focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right Side Header Items */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Active Role Quick Badge */}
        <Badge
          variant="outline"
          className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 border-primary/30 bg-primary/5 text-primary"
        >
          <CurrentRoleIcon className="w-3.5 h-3.5 text-primary" />
          <span>{currentRoleObj.label} Mode</span>
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full" />
        </Button>

        {/* User Account & Role Switcher Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 pl-2 pr-2.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[11px]">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline font-semibold text-foreground max-w-[120px] truncate">
                {user?.name || 'Account'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-bold text-foreground">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                <div className="pt-1">
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    Role: {userRole}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Quick Role Switcher (For live testing and role management) */}
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Switch Active Role (RBAC Demo)</span>
            </div>
            {rolesList.map((r) => {
              const Icon = r.icon
              const isCurrent = userRole === r.id
              return (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => {
                    switchRole(r.id)
                    toast.success(`Active role switched to: ${r.label.toUpperCase()}`)
                  }}
                  className={`flex items-center justify-between text-xs cursor-pointer ${
                    isCurrent ? 'bg-primary/10 font-bold text-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </div>
                  {isCurrent && <span className="text-[10px] font-bold">Active</span>}
                </DropdownMenuItem>
              )
            })}

            <DropdownMenuSeparator />

            {hasPermission('settings', 'read') && (
              <DropdownMenuItem asChild className="text-xs cursor-pointer">
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <span>Store Settings</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={logout} className="text-xs text-destructive cursor-pointer">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
