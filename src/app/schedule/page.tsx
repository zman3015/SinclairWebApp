"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Phone,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Wrench,
  AlertTriangle
} from "lucide-react"
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [showDayDetails, setShowDayDetails] = useState(false)

  // Sample appointment data spread across the month - Busy schedule
  const appointments = [
    // Today's appointments (4 appointments - max)
    {
      id: "APT-001",
      date: new Date(),
      time: "08:00",
      duration: 60,
      clinic: "Bright Smiles Dental",
      contact: "Dr. Sarah Johnson",
      phone: "(555) 123-4567",
      address: "123 Main St, Downtown",
      service: "Routine Maintenance",
      equipment: "A-Dec 500 Chair (2 units)",
      status: "Confirmed",
      priority: "Normal",
      notes: "Annual service for both chairs"
    },
    {
      id: "APT-002",
      date: new Date(),
      time: "10:30",
      duration: 90,
      clinic: "Family Dental Care",
      contact: "Dr. Michael Chen",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Midtown",
      service: "Emergency Repair",
      equipment: "Planmeca X-Ray Unit",
      status: "Confirmed",
      priority: "High",
      notes: "Unit not producing images properly"
    },
    {
      id: "APT-003",
      date: new Date(),
      time: "13:00",
      duration: 45,
      clinic: "Downtown Dentistry",
      contact: "Dr. Lisa Rodriguez",
      phone: "(555) 345-6789",
      address: "789 Pine St, Suite 200",
      service: "Installation",
      equipment: "New Dentsply Handpiece",
      status: "Pending",
      priority: "Normal",
      notes: "Install and test new equipment"
    },
    {
      id: "APT-004",
      date: new Date(),
      time: "15:30",
      duration: 60,
      clinic: "Premier Dental",
      contact: "Dr. James Wilson",
      phone: "(555) 111-2222",
      address: "555 Cedar St, Northside",
      service: "Follow-up",
      equipment: "Belmont Chair",
      status: "Confirmed",
      priority: "Normal",
      notes: "Post-repair inspection"
    },
    // Tomorrow's appointments (3 appointments)
    {
      id: "APT-005",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: "08:30",
      duration: 120,
      clinic: "Care Dental Group",
      contact: "Dr. Robert Wilson",
      phone: "(555) 456-7890",
      address: "321 Elm St, Uptown",
      service: "Emergency Repair",
      equipment: "A-Dec 500 Chair",
      status: "Urgent",
      priority: "High",
      notes: "Chair hydraulics failed"
    },
    {
      id: "APT-006",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: "11:00",
      duration: 75,
      clinic: "Smile Center",
      contact: "Dr. Emily Davis",
      phone: "(555) 567-8901",
      address: "456 Maple Ave, Westside",
      service: "Preventive Maintenance",
      equipment: "Belmont X-Calibur Chair",
      status: "Confirmed",
      priority: "Normal",
      notes: "Quarterly maintenance check"
    },
    {
      id: "APT-007",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: "14:30",
      duration: 60,
      clinic: "Modern Dentistry",
      contact: "Dr. Alex Parker",
      phone: "(555) 333-4444",
      address: "789 Birch Ave, Southside",
      service: "Installation",
      equipment: "New Dentsply Compressor",
      status: "Scheduled",
      priority: "Normal",
      notes: "New compressor installation"
    },
    // Day after tomorrow (4 appointments - max)
    {
      id: "APT-008",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "08:00",
      duration: 90,
      clinic: "Dental Excellence",
      contact: "Dr. Mark Thompson",
      phone: "(555) 678-9012",
      address: "789 Oak St, Eastside",
      service: "Emergency Repair",
      equipment: "Dentsply Handpiece Set",
      status: "Urgent",
      priority: "High",
      notes: "Complete handpiece failure"
    },
    {
      id: "APT-009",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "10:15",
      duration: 60,
      clinic: "Coastal Dental",
      contact: "Dr. Maria Santos",
      phone: "(555) 777-8888",
      address: "123 Beach Rd, Coastal",
      service: "Routine Maintenance",
      equipment: "A-Dec Light System",
      status: "Confirmed",
      priority: "Normal",
      notes: "LED light replacement"
    },
    {
      id: "APT-010",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "13:30",
      duration: 45,
      clinic: "Elite Dental Care",
      contact: "Dr. Kevin Chen",
      phone: "(555) 999-0000",
      address: "456 Summit Ave, Heights",
      service: "Warranty Service",
      equipment: "Planmeca X-Ray",
      status: "Confirmed",
      priority: "Normal",
      notes: "Warranty sensor replacement"
    },
    {
      id: "APT-011",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "15:45",
      duration: 75,
      clinic: "Family First Dental",
      contact: "Dr. Lisa Chang",
      phone: "(555) 222-3333",
      address: "789 Valley Rd, Suburbs",
      service: "Installation",
      equipment: "Belmont Delivery Unit",
      status: "Scheduled",
      priority: "Normal",
      notes: "New delivery system install"
    },
    // Spread more appointments across the month
    {
      id: "APT-012",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "09:00",
      duration: 60,
      clinic: "Metro Dental",
      contact: "Dr. Jennifer Lee",
      phone: "(555) 789-0123",
      address: "321 Pine Ave, Central",
      service: "Follow-up",
      equipment: "A-Dec Chair Controls",
      status: "Confirmed",
      priority: "Low",
      notes: "Control panel calibration"
    },
    {
      id: "APT-013",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "14:00",
      duration: 90,
      clinic: "Bright Smiles Dental",
      contact: "Dr. Sarah Johnson",
      phone: "(555) 123-4567",
      address: "123 Main St, Downtown",
      service: "Emergency Repair",
      equipment: "Suction System",
      status: "Urgent",
      priority: "High",
      notes: "Suction pump malfunction"
    },
    // Day 4
    {
      id: "APT-014",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      time: "08:30",
      duration: 75,
      clinic: "Advanced Dental",
      contact: "Dr. David Brown",
      phone: "(555) 444-5555",
      address: "654 River St, Riverside",
      service: "Preventive Maintenance",
      equipment: "Planmeca Imaging Unit",
      status: "Confirmed",
      priority: "Normal",
      notes: "Annual calibration service"
    },
    {
      id: "APT-015",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      time: "11:30",
      duration: 60,
      clinic: "Comfort Dental",
      contact: "Dr. Rachel Green",
      phone: "(555) 666-7777",
      address: "987 Comfort Ln, Westfield",
      service: "Installation",
      equipment: "New Handpiece System",
      status: "Scheduled",
      priority: "Normal",
      notes: "Upgrade to digital handpieces"
    },
    {
      id: "APT-016",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      time: "15:00",
      duration: 45,
      clinic: "Gentle Care Dental",
      contact: "Dr. Amanda White",
      phone: "(555) 888-9999",
      address: "321 Gentle Way, Peaceful",
      service: "Routine Maintenance",
      equipment: "A-Dec Cuspidor",
      status: "Confirmed",
      priority: "Normal",
      notes: "Cuspidor bowl replacement"
    },
    // Day 5 (2 appointments)
    {
      id: "APT-017",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: "10:00",
      duration: 90,
      clinic: "Precision Dental",
      contact: "Dr. Michael Torres",
      phone: "(555) 101-2020",
      address: "753 Precision Blvd, Tech District",
      service: "Emergency Repair",
      equipment: "Digital X-Ray Sensor",
      status: "Urgent",
      priority: "High",
      notes: "Sensor not responding"
    },
    {
      id: "APT-018",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: "13:45",
      duration: 60,
      clinic: "Sunny Dental",
      contact: "Dr. Carlos Martinez",
      phone: "(555) 303-4040",
      address: "159 Sunny St, Brightside",
      service: "Warranty Service",
      equipment: "Belmont Light",
      status: "Confirmed",
      priority: "Normal",
      notes: "Light arm adjustment"
    },
    // Day 6 (3 appointments)
    {
      id: "APT-019",
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: "09:15",
      duration: 75,
      clinic: "Excellence Dental",
      contact: "Dr. Patricia Kim",
      phone: "(555) 505-6060",
      address: "852 Excellence Ave, Professional Park",
      service: "Installation",
      equipment: "Panoramic X-Ray Unit",
      status: "Scheduled",
      priority: "Normal",
      notes: "Full panoramic system setup"
    },
    {
      id: "APT-020",
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: "12:00",
      duration: 60,
      clinic: "Prime Dental",
      contact: "Dr. Steven Lee",
      phone: "(555) 707-8080",
      address: "456 Prime St, Business District",
      service: "Follow-up",
      equipment: "Compressor System",
      status: "Confirmed",
      priority: "Low",
      notes: "Post-installation check"
    },
    {
      id: "APT-021",
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: "14:30",
      duration: 45,
      clinic: "Modern Smile Dental",
      contact: "Dr. Jennifer Wu",
      phone: "(555) 909-1010",
      address: "741 Modern Way, Innovation Center",
      service: "Preventive Maintenance",
      equipment: "Intraoral Camera",
      status: "Confirmed",
      priority: "Normal",
      notes: "Camera lens cleaning and calibration"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Urgent": return "bg-red-100 text-red-800"
      case "Scheduled": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800"
      case "Normal": return "bg-blue-100 text-blue-800"
      case "Low": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date))
  }

  const getClinicCountForDate = (date: Date) => {
    const dayAppointments = getAppointmentsForDate(date)
    const uniqueClinics = new Set(dayAppointments.map(apt => apt.clinic))
    return uniqueClinics.size
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowDayDetails(true)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const CustomCalendar = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startPadding = getDay(monthStart)

    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Empty cells for padding */}
          {Array.from({ length: startPadding }).map((_, index) => (
            <div key={`padding-${index}`} className="p-2 h-24"></div>
          ))}

          {/* Calendar days */}
          {monthDays.map(day => {
            const clinicCount = getClinicCountForDate(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={day.toISOString()}
                className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                  isToday ? "bg-dental-blue/10 border-dental-blue" : "border-gray-200"
                } ${isSelected ? "ring-2 ring-dental-blue" : ""}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="text-sm font-medium">{format(day, "d")}</div>
                {clinicCount > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      clinicCount >= 4 ? "bg-red-600" : clinicCount >= 3 ? "bg-red-500" : clinicCount >= 2 ? "bg-dental-yellow" : "bg-dental-blue"
                    }`}>
                      {clinicCount}
                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  return (
    <MainLayout
      title="Schedule Calendar"
      subtitle="Manage appointments and clinic visits"
    >
      <div className="space-y-6">
        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={viewMode === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                    className={viewMode === "month" ? "bg-dental-blue" : ""}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Month
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                    className={viewMode === "week" ? "bg-dental-blue" : ""}
                  >
                    Week
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-dental-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-dental-blue">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Clinics</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(appointments.map(apt => apt.clinic)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {appointments.filter(apt => apt.priority === "High").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Service Hours</p>
                  <p className="text-2xl font-bold text-dental-blue">
                    {(appointments.reduce((sum, apt) => sum + apt.duration, 0) / 60).toFixed(1)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <CustomCalendar />
          </div>

          {/* Day Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a Date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateAppointments.map(appointment => (
                      <div key={appointment.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-dental-blue" />
                            <span className="font-medium">{appointment.time}</span>
                            <span className="text-sm text-gray-500">({appointment.duration}min)</span>
                          </div>
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {appointment.priority}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-dental-blue">{appointment.clinic}</p>
                            <p className="text-sm text-gray-600">{appointment.contact}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Service:</p>
                            <p className="text-sm">{appointment.service}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Equipment:</p>
                            <p className="text-sm">{appointment.equipment}</p>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span>{appointment.address}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{appointment.phone}</span>
                          </div>

                          {appointment.notes && (
                            <div>
                              <p className="text-sm font-medium">Notes:</p>
                              <p className="text-sm text-gray-600">{appointment.notes}</p>
                            </div>
                          )}

                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" className="bg-dental-blue">
                            Start Service
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No appointments scheduled</p>
                    <p className="text-sm">Click on a date to see details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
