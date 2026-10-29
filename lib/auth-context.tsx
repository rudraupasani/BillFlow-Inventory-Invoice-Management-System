'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole } from './types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: UserRole | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (newRole: UserRole) => void
  hasPermission: (module: string, action: 'create' | 'read' | 'update' | 'delete') => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default permissions for each role
const rolePermissions: Record<UserRole, Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean }>> = {
  owner: {
    dashboard: { create: true, read: true, update: true, delete: true },
    customers: { create: true, read: true, update: true, delete: true },
    products: { create: true, read: true, update: true, delete: true },
    invoices: { create: true, read: true, update: true, delete: true },
    pos: { create: true, read: true, update: true, delete: true },
    inventory: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    settings: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
  },
  admin: {
    dashboard: { create: true, read: true, update: true, delete: true },
    customers: { create: true, read: true, update: true, delete: true },
    products: { create: true, read: true, update: true, delete: true },
    invoices: { create: true, read: true, update: true, delete: true },
    pos: { create: true, read: true, update: true, delete: true },
    inventory: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    settings: { create: true, read: true, update: true, delete: false },
    users: { create: true, read: true, update: true, delete: false },
  },
  manager: {
    dashboard: { create: true, read: true, update: true, delete: true },
    customers: { create: true, read: true, update: true, delete: true },
    products: { create: true, read: true, update: true, delete: true },
    invoices: { create: true, read: true, update: true, delete: true },
    pos: { create: true, read: true, update: true, delete: true },
    inventory: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    settings: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
  },
  staff: {
    dashboard: { create: false, read: true, update: false, delete: false },
    customers: { create: true, read: true, update: true, delete: false },
    products: { create: false, read: true, update: false, delete: false },
    invoices: { create: true, read: true, update: true, delete: false },
    pos: { create: true, read: true, update: true, delete: true },
    inventory: { create: false, read: true, update: true, delete: false },
    reports: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (in production, validate with backend)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      // Handle both { user: ... } and direct user object
      const userData = data.user || data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('userRole', userData.role)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const switchRole = (newRole: UserRole) => {
    if (!user) return
    const updatedUser: User = { ...user, role: newRole }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem('userRole', newRole)
  }

  const hasPermission = (module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!user) return false
    const permissions = rolePermissions[user.role]?.[module]
    return permissions ? permissions[action] : false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        login,
        logout,
        switchRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
