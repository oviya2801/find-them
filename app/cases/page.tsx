import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Search, Filter } from "lucide-react"
import Link from "next/link"
import { getCases } from "@/lib/database"

export default async function CasesPage() {
  const cases = await getCases({ status: "active" })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Active Missing Children Cases</h1>
          <p className="text-gray-600 text-lg">Browse all active cases and help us bring these children home safely.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name, location, or case number..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Priority Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-5">0-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="11-15">11-15 years</SelectItem>
                <SelectItem value="16+">16+ years</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">Showing {cases.length} active cases</p>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority Level</SelectItem>
                <SelectItem value="name">Child Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((case_item: any) => (
              <Card key={case_item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={
                      case_item.photo_urls?.[0] ||
                      `/placeholder.svg?height=300&width=300&query=missing child ${case_item.child_name}`
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
                      <Link href={`/cases/${case_item.id}`}>View Details</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/report-sighting?case=${case_item.id}`}>Report Sighting</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {cases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No cases match your current filters.</p>
              <Button asChild className="mt-4 bg-transparent" variant="outline">
                <Link href="/cases">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
