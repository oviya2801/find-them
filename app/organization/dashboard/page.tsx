import { requireAuth } from "@/lib/auth"
import { getCases, getSightingsByCase } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Eye, AlertTriangle, Plus, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await requireAuth(["ngo_admin", "ngo_member", "police", "admin"])

  // Get organization's cases and statistics
  const organizationCases = await getCases({ organization_id: user.organization_id })
  const activeCases = organizationCases.filter((c: any) => c.status === "active")
  const foundCases = organizationCases.filter((c: any) => c.status === "found")
  const urgentCases = organizationCases.filter((c: any) => c.priority === "urgent")

  // Get recent sightings for organization's cases
  const recentSightings = []
  for (const case_item of organizationCases.slice(0, 5)) {
    const sightings = await getSightingsByCase(case_item.id)
    recentSightings.push(...sightings.slice(0, 2))
  }
  recentSightings.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user.name} • {user.organization_name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/organization/dashboard/cases/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Case
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCases.length}</div>
              <p className="text-xs text-muted-foreground">Currently investigating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children Found</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{foundCases.length}</div>
              <p className="text-xs text-muted-foreground">Successfully reunited</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentCases.length}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Sightings</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{recentSightings.length}</div>
              <p className="text-xs text-muted-foreground">In the last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Cases</CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/organization/dashboard/cases">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizationCases.slice(0, 5).map((case_item: any) => (
                    <div key={case_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              case_item.photo_urls?.[0] ||
                              `/placeholder.svg?height=48&width=48&query=missing child ${case_item.child_name || "/placeholder.svg"}`
                            }
                            alt={case_item.child_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{case_item.child_name}</h3>
                          <p className="text-sm text-gray-600">
                            Age: {case_item.age || "Unknown"} • Case #{case_item.case_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            case_item.priority === "urgent"
                              ? "bg-red-500"
                              : case_item.priority === "high"
                                ? "bg-orange-500"
                                : case_item.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                          }`}
                        >
                          {case_item.priority}
                        </Badge>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/organization/dashboard/cases/${case_item.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {organizationCases.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p>No cases yet. Create your first case to get started.</p>
                      <Button asChild className="mt-4">
                        <Link href="/organization/dashboard/cases/new">Create First Case</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Sightings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sightings</CardTitle>
                <CardDescription>Latest community reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSightings.slice(0, 5).map((sighting: any) => (
                    <div key={sighting.id} className="border-l-4 border-blue-500 pl-3 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium">{sighting.sighting_location}</p>
                        <Badge
                          variant={
                            sighting.status === "verified"
                              ? "default"
                              : sighting.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {sighting.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{new Date(sighting.sighting_date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{sighting.description}</p>
                    </div>
                  ))}
                  {recentSightings.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent sightings</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/organization/dashboard/cases/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Case
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/organization/dashboard/sightings">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Sightings
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/organization/dashboard/team">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Team
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/organization/dashboard/reports">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Reports
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
