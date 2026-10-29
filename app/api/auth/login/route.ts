import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo purposes, accept any email/password
    // In production, validate against hashed passwords with bcrypt
    // Determine role from email
    const lowerEmail = email.toLowerCase()
    let role: 'owner' | 'admin' | 'manager' | 'staff' = 'staff'
    if (lowerEmail.includes('owner') || lowerEmail === 'demo@example.com') {
      role = 'owner'
    } else if (lowerEmail.includes('admin')) {
      role = 'admin'
    } else if (lowerEmail.includes('manager')) {
      role = 'manager'
    } else {
      role = 'staff'
    }

    let user = await db.getUserByEmail(email)

    if (!user) {
      user = await db.createUser({
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        storeId: 'store-1',
        isActive: true,
      })
    } else if (user.role !== role && (lowerEmail.includes('manager') || lowerEmail.includes('staff') || lowerEmail.includes('admin') || lowerEmail.includes('owner') || lowerEmail === 'demo@example.com')) {
      user.role = role
    }

    const response = NextResponse.json(
      { user },
      { status: 200 }
    )

    // Set session cookie (in production, use secure HTTP-only cookies)
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
