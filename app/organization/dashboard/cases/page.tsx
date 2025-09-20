import { requireAuth } from "@/lib/auth"
import { getCases } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Search, Filter, Plus, Eye } from "lucide-react"
import Link from "next/link"

export default async function CasesPage() {
  const user = await requireAuth(["ngo_admin", "ngo_member", "police", "admin"])
  const cases = await getCases({ organization_id: user.organization_id })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases Management</h1>
          <p className="text-gray-600">Manage your organization's missing children cases</p>
        </div>
        <Button asChild>
          <Link href="/organization/dashboard/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name, case number, or location..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="found">Found</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((case_item: any) => (
          <Card key={case_item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-gray-100">
              <img
                src={
                  case_item.photo_urls?.[0] ||
                  `/placeholder.svg?height=300&width=300&query=missing child ${case_item.child_name || "/placeholder.svg"}`
                }
                alt={`Photo of ${case_item.child_name}`}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-2 right-2 ${
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
              <Badge className="absolute top-2 left-2 bg-blue-600">{case_item.case_number}</Badge>
              <Badge
                className={`absolute bottom-2 right-2 ${
                  case_item.status === "active"
                    ? "bg-green-600"
                    : case_item.status === "found"
                      ? "bg-blue-600"
                      : "bg-gray-600"
                }`}
              >
                {case_item.status}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{case_item.child_name}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span>Age: {case_item.age || "Unknown"}</span>
                <span className="capitalize">{case_item.gender}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{case_item.last_seen_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(case_item.last_seen_date).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{case_item.description}</p>
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-transparent" variant="outline">
                  <Link href={`/organization/dashboard/cases/${case_item.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href={`/organization/dashboard/cases/${case_item.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first missing child case.</p>
            <Button asChild>
              <Link href="/organization/dashboard/cases/new">
                <Plus className="mr-2 h-4 w-4" />
                Create First Case
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
