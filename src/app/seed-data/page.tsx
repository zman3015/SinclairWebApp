"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { seedData, deleteAllUserData } from "@/lib/seedData"

export default function SeedDataPage() {
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: unknown } | null>(null)

  // Debug: Log user data to see what we're getting
  console.log("🔍 SeedDataPage - User:", user?.email)
  console.log("🔍 SeedDataPage - UserData:", userData)
  console.log("🔍 SeedDataPage - Role:", userData?.role)

  const handleSeedData = async () => {
    if (!user) {
      alert("Please log in first!")
      return
    }

    if (userData?.role !== "admin") {
      alert("Only admin users can seed test data!")
      return
    }

    const confirmed = confirm(
      "This will add test data to the database including:\n\n" +
      "• 5 Clients/Accounts\n" +
      "• 5 Equipment items with QR codes\n" +
      "• 3 Invoices\n" +
      "• 5 Inventory parts\n" +
      "• 2 Service records\n" +
      "• 3 Scheduled appointments\n\n" +
      "Continue?"
    )

    if (!confirmed) return

    setLoading(true)
    setResult(null)

    try {
      const res = await seedData(user.uid)
      setResult(res)
    } catch (error) {
      setResult({ success: false, error })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteData = async () => {
    if (!user) {
      alert("Please log in first!")
      return
    }

    const confirmed = confirm(
      "⚠️ WARNING: This will DELETE ALL your data including:\n\n" +
      "• All Clients/Accounts\n" +
      "• All Equipment items\n" +
      "• All Invoices\n" +
      "• All Inventory parts\n" +
      "• All Service records\n" +
      "• All Scheduled appointments\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure you want to continue?"
    )

    if (!confirmed) return

    // Double confirmation
    const doubleConfirm = confirm(
      "FINAL WARNING!\n\n" +
      "This will permanently delete ALL your data.\n\n" +
      "Type 'DELETE' in the next prompt to confirm."
    )

    if (!doubleConfirm) return

    const userInput = prompt("Type 'DELETE' to confirm deletion:")
    if (userInput !== "DELETE") {
      alert("Deletion cancelled. You must type 'DELETE' exactly.")
      return
    }

    setDeleting(true)
    setResult(null)

    try {
      const res = await deleteAllUserData(user.uid)
      setResult({
        success: res.success,
        message: res.message,
        error: res.error
      })
    } catch (error) {
      setResult({ success: false, error })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <MainLayout
      title="Seed Test Data"
      subtitle="Populate database with sample data for testing"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Test Data Seeding
            </CardTitle>
            <CardDescription>
              This will populate your database with sample data for testing purposes.
              Only use this for the <strong>admin</strong> account.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role:</span>
                  <Badge className={userData?.role === "admin" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {userData?.role || "loading..."}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user.uid}</code>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Not logged in</p>
            )}
          </CardContent>
        </Card>

        {/* What Will Be Added */}
        <Card>
          <CardHeader>
            <CardTitle>Test Data to be Added</CardTitle>
            <CardDescription>
              The following sample data will be created in your database:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">5 Clients/Accounts</p>
                  <p className="text-sm text-gray-600">Bright Smiles Dental, Family Dental Care, Downtown Dental Group, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">5 Equipment Items</p>
                  <p className="text-sm text-gray-600">A-Dec chairs, vacuum systems, and dental units with QR codes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">3 Invoices</p>
                  <p className="text-sm text-gray-600">Sample invoices with different statuses (Paid, Pending, Overdue)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">5 Inventory Parts</p>
                  <p className="text-sm text-gray-600">Hydraulic pumps, control panels, seal kits, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">2 Service Records</p>
                  <p className="text-sm text-gray-600">Completed maintenance and repair records</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">3 Scheduled Appointments</p>
                  <p className="text-sm text-gray-600">Upcoming maintenance, installation, and repair appointments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Important Notes:</p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                  <li>Only run this ONCE for the admin account</li>
                  <li>All data will be associated with the logged-in user</li>
                  <li>Do NOT run this for the regular user account</li>
                  <li>This is for demo/testing purposes only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Button
              onClick={handleSeedData}
              disabled={loading || deleting || !user || userData?.role !== "admin"}
              className="w-full bg-dental-blue hover:bg-blue-700 h-12 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Seeding Test Data...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 mr-2" />
                  Seed Test Data
                </>
              )}
            </Button>

            <Button
              onClick={handleDeleteData}
              disabled={loading || deleting || !user}
              variant="destructive"
              className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Deleting All Data...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete All My Data
                </>
              )}
            </Button>

            {!user && (
              <p className="text-sm text-gray-500 text-center mt-3">
                Please log in to manage data
              </p>
            )}

            {user && userData?.role !== "admin" && (
              <p className="text-sm text-yellow-600 text-center mt-3">
                Note: You can delete your data anytime, but only admins can seed test data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {result.success ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Success!</p>
                      <p className="text-sm text-green-800 mt-1">
                        {result.message || "Test data has been added to the database."}
                      </p>
                      <p className="text-sm text-green-700 mt-2">
                        You can now navigate to different pages to see the populated data!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Error</p>
                      <p className="text-sm text-red-800 mt-1">
                        {(result.error as Error)?.message || "Failed to seed data. Check console for details."}
                      </p>
                      <pre className="text-xs bg-red-100 p-2 rounded mt-2 overflow-auto">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
