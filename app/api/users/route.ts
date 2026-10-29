import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Mock users list stored in db
let mockUsers: any[] = []

export async function GET() {
  try {
    return NextResponse.json(mockUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await db.createUser(body)
    mockUsers.push(user)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
  }
}
