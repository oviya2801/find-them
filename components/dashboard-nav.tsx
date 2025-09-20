"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, FileText, Eye, Users, Settings, TrendingUp, LogOut, Heart, Bell, Search } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface DashboardNavProps {
  user: AuthUser
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    {
      href: "/organization/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/organization/dashboard/cases",
      label: "Cases",
      icon: FileText,
    },
    {
      href: "/organization/dashboard/sightings",
      label: "Sightings",
      icon: Eye,
      badge: "3", // This would be dynamic in a real app
    },
    {
      href: "/organization/dashboard/team",
      label: "Team",
      icon: Users,
      roles: ["ngo_admin", "admin"], // Only show for admins
    },
    {
      href: "/organization/dashboard/reports",
      label: "Reports",
      icon: TrendingUp,
    },
    {
      href: "/organization/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user.role))

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FindThem</span>
        </Link>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-600">{user.organization_name}</p>
          <Badge variant="secondary" className="text-xs">
            {user.role.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button asChild size="sm" className="w-full justify-start bg-transparent" variant="outline">
            <Link href="/cases">
              <Search className="mr-2 h-3 w-3" />
              Browse Public Cases
            </Link>
          </Button>
          <Button asChild size="sm" className="w-full justify-start bg-transparent" variant="outline">
            <Link href="/report-sighting">
              <Bell className="mr-2 h-3 w-3" />
              Report Sighting
            </Link>
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full justify-start text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
