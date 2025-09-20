import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, User, Phone, Mail, AlertTriangle, Camera, Share2 } from "lucide-react"
import Link from "next/link"
import { getCaseById, getSightingsByCase } from "@/lib/database"
import { notFound } from "next/navigation"

interface CaseDetailPageProps {
  params: {
    id: string
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const caseId = Number.parseInt(params.id)
  const case_item = await getCaseById(caseId)

  if (!case_item) {
    notFound()
  }

  const sightings = await getSightingsByCase(caseId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{case_item.child_name}</h1>
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
                  {case_item.priority} Priority
                </Badge>
              </div>
              <p className="text-gray-600 text-lg">Case #{case_item.case_number}</p>
            </div>
            <div className="flex gap-3">
              <Button>
                <Share2 className="mr-2 h-4 w-4" />
                Share Case
              </Button>
              <Button asChild>
                <Link href={`/report-sighting?case=${case_item.id}`}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Sighting
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {case_item.photo_urls?.map((url: string, index: number) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={url || `/placeholder.svg?height=400&width=400&query=missing child ${case_item.child_name}`}
                        alt={`Photo ${index + 1} of ${case_item.child_name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )) || (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`/missing-child-.jpg?height=400&width=400&query=missing child ${case_item.child_name}`}
                        alt={`Photo of ${case_item.child_name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{case_item.description || "No description available."}</p>
                {case_item.additional_info && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Additional Information</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      {Object.entries(case_item.additional_info).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium capitalize">{key.replace("_", " ")}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sightings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sightings ({sightings.length})</CardTitle>
                <CardDescription>Community reported sightings for this case</CardDescription>
              </CardHeader>
              <CardContent>
                {sightings.length > 0 ? (
                  <div className="space-y-4">
                    {sightings.slice(0, 5).map((sighting: any) => (
                      <div key={sighting.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{sighting.sighting_location}</span>
                          </div>
                          <Badge
                            variant={
                              sighting.status === "verified"
                                ? "default"
                                : sighting.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {sighting.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>{new Date(sighting.sighting_date).toLocaleDateString()}</span>
                          {sighting.sighting_time && <span>{sighting.sighting_time}</span>}
                          {sighting.confidence_level && <span>Confidence: {sighting.confidence_level}/5</span>}
                        </div>
                        {sighting.description && <p className="text-sm text-gray-700">{sighting.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No sightings reported yet. Be the first to help by reporting a sighting.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Details */}
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">{case_item.age || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium capitalize">{case_item.gender || "Unknown"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Last Seen Location</p>
                    <p className="font-medium">{case_item.last_seen_location || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Last Seen Date</p>
                    <p className="font-medium">
                      {case_item.last_seen_date ? new Date(case_item.last_seen_date).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600 mb-1">Case Status</p>
                  <Badge variant="secondary" className="capitalize">
                    {case_item.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Date Reported</p>
                  <p className="font-medium">{new Date(case_item.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>How You Can Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/report-sighting?case=${case_item.id}`}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report a Sighting
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/photo-match">
                    <Camera className="mr-2 h-4 w-4" />
                    Use Photo Matching
                  </Link>
                </Button>

                <Button variant="outline" className="w-full bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share This Case
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  If you have immediate information about this child's whereabouts:
                </p>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call 911
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-700 bg-transparent">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
