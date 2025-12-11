"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { UserRoleType } from "@/lib/models/user"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Loader2, User, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "tech" as UserRoleType,
    companyName: "",
    phone: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role,
        formData.companyName,
        formData.phone
      )
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-blue/10 to-dental-yellow/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Image
                src="/sinclair-logo.jpg"
                alt="Sinclair Dental"
                width={220}
                height={62}
                className="h-auto w-auto max-h-[62px]"
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Get started with your dental tech portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRoleType) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Admin - Full Access
                    </div>
                  </SelectItem>
                  <SelectItem value="tech">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Technician - Edit Access
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Viewer - Read Only
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {formData.role === "admin"
                  ? "Full access to all features including user management"
                  : formData.role === "tech"
                  ? "Can create, edit, and delete operational data"
                  : "Read-only access to all data"
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                placeholder="Medline Sinclair"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-dental-blue hover:bg-dental-blue/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-dental-blue hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
