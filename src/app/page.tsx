"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  QrCode,
  Package,
  FileText,
  TrendingUp,
  Users
} from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
  const { userData } = useAuth()
  // Sample data for demo
  const stats = [
    {
      title: "Today's Repairs",
      value: "8",
      change: "+2 from yesterday",
      icon: Wrench,
      color: "bg-dental-blue"
    },
    {
      title: "Scheduled Appointments",
      value: "12",
      change: "Next in 30 min",
      icon: Calendar,
      color: "bg-dental-yellow"
    },
    {
      title: "Completed This Week",
      value: "34",
      change: "+12% from last week",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Parts Inventory",
      value: "156",
      change: "5 low stock items",
      icon: Package,
      color: "bg-orange-500"
    }
  ]

  const recentRepairs = [
    {
      id: "DT-2023-145",
      equipment: "A-Dec 500 Chair",
      clinic: "Bright Smiles Dental",
      status: "Completed",
      date: "2023-08-20",
      technician: "John Doe"
    },
    {
      id: "DT-2023-144",
      equipment: "Planmeca X-Ray Unit",
      clinic: "Family Dental Care",
      status: "In Progress",
      date: "2023-08-20",
      technician: "John Doe"
    },
    {
      id: "DT-2023-143",
      equipment: "Dentsply Handpiece",
      clinic: "Downtown Dentistry",
      status: "Pending Parts",
      date: "2023-08-19",
      technician: "John Doe"
    }
  ]

  const upcomingAppointments = [
    {
      time: "10:30 AM",
      clinic: "Bright Smiles Dental",
      service: "Routine Maintenance",
      equipment: "A-Dec 500 Series"
    },
    {
      time: "2:00 PM",
      clinic: "Care Dental Group",
      service: "Emergency Repair",
      equipment: "Planmeca X-Ray"
    },
    {
      time: "4:15 PM",
      clinic: "Family Dental Care",
      service: "Installation",
      equipment: "New Handpiece"
    }
  ]

  return (
    <ProtectedRoute>
      <MainLayout
        title="Dashboard"
        subtitle={`Welcome back, ${userData?.displayName || 'User'}! Here's what's happening today.`}
      >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="bg-dental-blue hover:bg-dental-blue/90 h-20 flex-col">
                <QrCode className="h-6 w-6 mb-2" />
                Scan Equipment
              </Button>
              <Button variant="outline" className="h-20 flex-col border-dental-yellow text-dental-blue hover:bg-dental-yellow/10">
                <Wrench className="h-6 w-6 mb-2" />
                New Repair
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                Create Invoice
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Package className="h-6 w-6 mb-2" />
                Check Inventory
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Repairs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Repairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRepairs.map((repair) => (
                  <div key={repair.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{repair.equipment}</p>
                        <Badge
                          variant={repair.status === "Completed" ? "default" : repair.status === "In Progress" ? "secondary" : "outline"}
                          className={repair.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                        >
                          {repair.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{repair.clinic}</p>
                      <p className="text-xs text-gray-400">#{repair.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{repair.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="flex items-center justify-center w-12 h-12 bg-dental-blue/10 rounded-lg">
                      <Clock className="h-5 w-5 text-dental-blue" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{appointment.time}</p>
                        <Badge variant="outline" className="text-xs">
                          {appointment.service}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.clinic}</p>
                      <p className="text-xs text-gray-500">{appointment.equipment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-dental-blue/5">
                <TrendingUp className="h-8 w-8 text-dental-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-dental-blue">94%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-dental-yellow/5">
                <Users className="h-8 w-8 text-dental-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-dental-blue">47</p>
                <p className="text-sm text-gray-600">Satisfied Clinics</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
    </ProtectedRoute>
  )
}
