import type React from "react"
import { requireAuth } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth(["ngo_admin", "ngo_member", "police", "admin"])

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
