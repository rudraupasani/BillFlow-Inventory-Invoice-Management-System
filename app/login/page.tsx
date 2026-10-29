'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Receipt,
  CheckCircle2,
  Crown,
  UserCheck,
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const quickRoles = [
    {
      role: 'Owner',
      email: 'demo@example.com',
      badge: 'Full Access',
      icon: Crown,
      color: 'border-amber-500/30 text-amber-600 bg-amber-500/5 hover:bg-amber-500/10',
    },
    {
      role: 'Manager',
      email: 'manager@billflow.com',
      badge: 'Ops & Inventory',
      icon: UserCheck,
      color: 'border-blue-500/30 text-blue-600 bg-blue-500/5 hover:bg-blue-500/10',
    },
    {
      role: 'Cashier / POS',
      email: 'staff@billflow.com',
      badge: 'Billing Only',
      icon: Receipt,
      color: 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10',
    },
  ]

  const selectDemoRole = (roleEmail: string) => {
    setEmail(roleEmail)
    setPassword('password123')
    toast.info(`Filled credentials for ${roleEmail}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back to BillFlow!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Login failed. Please verify your credentials.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-foreground block">
                Bill<span className="text-primary">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                Fintech & POS OS
              </span>
            </div>
          </Link>

          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs border-primary/20 bg-primary/5 text-primary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            v2.4 Enterprise Live
          </Badge>
        </div>

        {/* Center Login Form */}
        <div className="max-w-md w-full mx-auto my-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage POS billing, stock inventory, and GST compliance.
            </p>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick 1-Click Demo Login:
              </span>
              <span className="text-[11px] text-muted-foreground/80">Click any role</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickRoles.map((r) => {
                const Icon = r.icon
                const isSelected = email === r.email
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => selectDemoRole(r.email)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                        : `${r.color}`
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{r.role}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                      {r.badge}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border" />
            <span className="flex-shrink mx-3 text-xs text-muted-foreground uppercase font-semibold">
              Or with credentials
            </span>
            <div className="flex-grow border-t border-border" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-foreground">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11 text-sm bg-card border-border/80 focus-visible:ring-primary shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-pass" className="text-xs font-semibold text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('For this demo, any password works!')}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10 h-11 text-sm bg-card border-border/80 focus-visible:ring-primary shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-xs text-muted-foreground cursor-pointer select-none">
                Remember this terminal for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white shadow-md shadow-primary/20 gap-2 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying session...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Security Guarantee */}
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-muted-foreground border-t border-border/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Sub-second POS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> GST Ready
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          © {new Date().getFullYear()} BillFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Right Hero Showcase Section (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden items-center justify-center p-12">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Inner Content Card */}
        <div className="relative z-10 max-w-lg w-full space-y-6">
          {/* Hero 3D Graphic */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-950/80 bg-slate-900/60 backdrop-blur-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/login-hero.jpg"
              alt="BillFlow Futuristic Financial Dashboard"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2.5 py-1 bg-primary/20 rounded-full w-fit backdrop-blur-md border border-primary/30 mb-2">
                Real-Time Retail & Invoicing
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Unified Point of Sale & Financial Management
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Instant UPI payment QR codes, rapid 80mm thermal receipt printing, and live inventory sync in one unified cloud dashboard.
              </p>
            </div>
          </div>

          {/* Mini Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 text-white">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Receipt className="w-4 h-4" />
                <span>Multi-Cart POS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Park & resume bills with keyboard shortcuts (F2, F8, F9).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Zap className="w-4 h-4" />
                <span>Khata & Credit</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Track customer balances and record partial repayments.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">M</div>
                <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">S</div>
              </div>
              <span className="text-[11px] font-medium text-slate-300">Used by 2,500+ businesses</span>
            </div>
            <span className="text-[11px] font-bold text-primary">★★★★★ 4.9/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
