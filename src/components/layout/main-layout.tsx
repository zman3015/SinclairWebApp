"use client"

import { useState } from "react"
import { TopNav } from "./sidebar-nav"
import { Header } from "./header"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNav />

      {/* Main content */}
      <div className="flex flex-col">
        <Header
          title={title}
          subtitle={subtitle}
        />

        {/* Page content */}
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
