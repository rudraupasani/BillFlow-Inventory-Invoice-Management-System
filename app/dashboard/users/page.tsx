'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

const mockUsers = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@store.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    name: 'Store Manager',
    email: 'manager@store.com',
    role: 'manager',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'user-3',
    name: 'Cashier Staff',
    email: 'cashier@store.com',
    role: 'staff',
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as const,
  })

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      // In production, call API endpoint
      const user = {
        id: `user-${Date.now()}`,
        ...newUser,
        isActive: true,
        createdAt: new Date(),
      }

      setUsers([...users, user])
      setNewUser({ name: '', email: '', password: '', role: 'staff' })
      setIsAddingUser(false)
      toast.success('User added successfully')
    } catch (error) {
      toast.error('Failed to add user')
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId))
    toast.success('User deleted')
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default'
      case 'admin':
        return 'secondary'
      case 'manager':
        return 'outline'
      case 'staff':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage team members and their access permissions
        </p>
      </div>

      {/* Add User Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>Create a new team member account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAddingUser ? (
            <Button onClick={() => setIsAddingUser(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add New User
            </Button>
          ) : (
            <div className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">Temporary Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <div className="flex gap-2">
                <Button onClick={handleAddUser} className="flex-1">
                  Create User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingUser(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage all team member accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Add your first team member.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
          <CardDescription>
            Overview of permissions for each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Owner</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Full system access</li>
                <li>User management</li>
                <li>Settings control</li>
                <li>All operations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Admin</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Most operations</li>
                <li>Limited user mgmt</li>
                <li>Reports & analytics</li>
                <li>Cannot delete users</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Manager</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>View dashboard</li>
                <li>Manage inventory</li>
                <li>Process invoices</li>
                <li>Cannot change settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Staff</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>POS operations</li>
                <li>View reports</li>
                <li>Create invoices</li>
                <li>Limited access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
