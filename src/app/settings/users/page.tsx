"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useUsers } from "@/lib/hooks/useUser"
import { UserRoleType } from "@/lib/models/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield, Users, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UserManagementPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const { users, loading, error, updateUserRole } = useUsers()
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAdmin()) {
      router.push('/')
    }
  }, [authLoading, isAdmin, router])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId)
      await updateUserRole(userId, newRole as UserRoleType)
    } catch (err) {
      console.error('Failed to update role:', err)
    } finally {
      setUpdating(null)
    }
  }

  const getRoleBadgeColor = (role: UserRoleType) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'tech':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (authLoading || (!isAdmin() && !authLoading)) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>All Users</CardTitle>
          </div>
          <CardDescription>
            Assign roles to control access levels. Admin has full access, Tech can edit operational data, Viewer has read-only access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load users: {error.message}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => {
                if (!user.id) return null
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id!, value)}
                        disabled={updating === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-900">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-red-900">Admin</p>
            <p className="text-muted-foreground">Full access to all features, including user management</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900">Tech</p>
            <p className="text-muted-foreground">Can create, edit, and delete operational data (accounts, equipment, repairs, invoices, HARP inspections, schedules, manuals)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Viewer</p>
            <p className="text-muted-foreground">Read-only access to all data, cannot make any changes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
