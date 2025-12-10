"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFirestoreCollection } from "@/lib/firestore-hooks"
import { Loader2, CheckCircle, XCircle, Database } from "lucide-react"

export default function TestDatabase() {
  const { data: testItems, loading, addItem, deleteItem } = useFirestoreCollection('test')
  const [testName, setTestName] = useState("")
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleSaveTest = async () => {
    if (!testName.trim()) return

    setSaveStatus('saving')
    setErrorMessage("")

    try {
      await addItem({
        name: testName,
        timestamp: new Date().toISOString(),
        message: "Test data from dental tech portal"
      })
      
      setSaveStatus('success')
      setTestName("")
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error("Save error:", error)
      setSaveStatus('error')
      setErrorMessage(error instanceof Error ? error.message : "Failed to save")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout
        title="Database Test"
        subtitle="Test Firestore connection and data persistence"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Card */}
          <Card className="border-dental-blue">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-dental-blue" />
                Firestore Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-dental-blue" />
                      <span className="text-gray-600">Loading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-semibold">Connected to Firestore</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Collection: <code className="bg-gray-100 px-2 py-1 rounded">test</code>
                </p>
                <p className="text-sm text-gray-600">
                  Items in database: <span className="font-semibold">{testItems.length}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Data Save</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  placeholder="Enter a test name..."
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveTest()}
                />
              </div>

              <Button
                onClick={handleSaveTest}
                className="w-full bg-dental-blue hover:bg-dental-blue/90"
                disabled={!testName.trim() || saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving to Firestore...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved Successfully!
                  </>
                ) : (
                  'Save to Firestore'
                )}
              </Button>

              {saveStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start space-x-2">
                  <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Error saving data</p>
                    <p className="text-sm">{errorMessage}</p>
                    <p className="text-xs mt-2">
                      Make sure you've published the Firestore security rules.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Items */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Test Items ({testItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {testItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No test items yet. Add one above to test the database.
                </p>
              ) : (
                <div className="space-y-2">
                  {testItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ID: {item.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Testing Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Enter a test name above and click "Save to Firestore"</li>
                <li>If successful, the item will appear in the list below</li>
                <li>Check your Firebase Console to see the data</li>
                <li>Try deleting an item to test delete functionality</li>
              </ol>
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="text-xs font-semibold mb-1">View in Firebase Console:</p>
                <a
                  href="https://console.firebase.google.com/project/dentech-sap/firestore/databases/-default-/data/~2Ftest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-dental-blue hover:underline"
                >
                  Open Firestore → test collection
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
