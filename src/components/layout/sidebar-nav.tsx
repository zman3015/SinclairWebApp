"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import {
  Home,
  QrCode,
  Wrench,
  Calendar,
  FileText,
  Package,
  Search,
  BookOpen,
  Settings,
  ClipboardList,
  ShoppingCart,
  BarChart3,
  Bell,
  Menu,
  X,
  Building2,
  Database
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Scanner",
    href: "/scanner",
    icon: QrCode,
    description: "Scan equipment codes"
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: Building2,
    description: "Client management"
  },
  {
    name: "Equipment",
    href: "/equipment",
    icon: Wrench,
    description: "Device management"
  },
  {
    name: "Schedule",
    href: "/schedule",
    icon: Calendar,
    description: "Service appointments"
  },

  {
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
    description: "Billing & payments"
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    description: "Personal stock management"
  },
  {
    name: "Parts Catalog",
    href: "/parts",
    icon: Search,
    description: "SKU & stock search"
  },
  {
    name: "Service Manuals",
    href: "/manuals",
    icon: BookOpen,
    description: "Equipment documentation"
  },
  {
    name: "HARP Inspections",
    href: "/harp-inspections/new",
    icon: ClipboardList,
    description: "X-Ray inspections"
  }
]

interface TopNavProps {
  className?: string
}

export function TopNav({ className }: TopNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, userData, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className={cn("flex items-center justify-between bg-white border-b px-4 py-3", className)}>
        {/* Sinclair Dental Logo - Left side */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src="/sinclair-logo.jpg"
              alt="Sinclair Dental"
              width={200}
              height={57}
              className="h-auto w-auto max-h-[57px]"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Centered Navigation */}
        <div className="flex-1 flex items-center justify-center space-x-2">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-gray-100",
                      isActive && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Home Dashboard Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100",
                pathname === "/" && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
              )}
            >
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Right side - Settings and Notifications */}
        <div className="flex items-center space-x-2">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                {userData ? (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-dental-blue text-white text-xs">
                      {getInitials(userData.displayName)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Settings className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User Profile */}
              {userData && (
                <>
                  <div className="flex items-center space-x-2 p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-dental-blue text-white text-xs">
                        {getInitials(userData.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{userData.displayName}</p>
                      <p className="text-xs text-gray-500">{userData.role === 'admin' ? 'Administrator' : 'Technician'}</p>
                    </div>
                    <Badge variant="secondary" className={cn(
                      "text-xs",
                      userData.role === 'admin' ? "bg-dental-yellow text-gray-900" : "bg-blue-100 text-blue-800"
                    )}>
                      {userData.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Reports */}
              <Link href="/reports">
                <DropdownMenuItem className={cn(
                  "cursor-pointer",
                  pathname === "/reports" && "bg-dental-yellow/20"
                )}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reports
                </DropdownMenuItem>
              </Link>

              {/* Settings */}
              <Link href="/settings">
                <DropdownMenuItem className={cn(
                  "cursor-pointer",
                  pathname === "/settings" && "bg-dental-yellow/20"
                )}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>

              {/* Seed Data (Admin Only) */}
              {userData?.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <Link href="/seed-data">
                    <DropdownMenuItem className={cn(
                      "cursor-pointer",
                      pathname === "/seed-data" && "bg-dental-yellow/20"
                    )}>
                      <Database className="mr-2 h-4 w-4" />
                      Seed Test Data
                    </DropdownMenuItem>
                  </Link>
                </>
              )}

              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hidden sm:flex">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          {/* Version */}
          <div className="hidden xl:block text-xs text-gray-500">
            v1.0.0 Demo
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b">
          <nav className="px-6 py-4 space-y-2">
            {/* Dashboard for mobile */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-2 py-3 text-gray-700 hover:bg-gray-100",
                  pathname === "/" && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
                )}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>

            {/* Other navigation items */}
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start space-x-2 py-3 text-gray-700 hover:bg-gray-100",
                      isActive && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}

            {/* Reports for mobile */}
            <Link href="/reports" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-2 py-3 text-gray-700 hover:bg-gray-100",
                  pathname === "/reports" && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </Button>
            </Link>

            {/* Settings for mobile */}
            <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-2 py-3 text-gray-700 hover:bg-gray-100",
                  pathname === "/settings" && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>

            {/* Seed Data for mobile (Admin Only) */}
            {userData?.role === 'admin' && (
              <Link href="/seed-data" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start space-x-2 py-3 text-gray-700 hover:bg-gray-100",
                    pathname === "/seed-data" && "bg-dental-yellow text-gray-900 hover:bg-dental-yellow/90"
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span>Seed Test Data</span>
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
