import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Heart, ArrowRight, MapPin, Clock, Camera } from "lucide-react"
import Link from "next/link"
import { getCases } from "@/lib/database"

export default async function HomePage() {
  // Get recent active cases for the homepage
  const recentCases = await getCases({ status: "active", limit: 6 })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Help Bring Missing Children Home</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            FindThem is a collaborative platform connecting NGOs, law enforcement, and communities to locate missing
            children and reunite families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/cases">
                <Search className="mr-2 h-5 w-5" />
                Browse Active Cases
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/photo-match">
                <Camera className="mr-2 h-5 w-5" />
                Try Photo Matching
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">150+</div>
              <div className="text-gray-600">Active Cases</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">89</div>
              <div className="text-gray-600">Children Found</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">25</div>
              <div className="text-gray-600">Partner Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How FindThem Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Organizations Report</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Verified NGOs and law enforcement agencies submit missing children cases with photos and details.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>AI Photo Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced AI technology compares photos to find potential matches and help identify missing children.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Families Reunited</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Verified sightings help organizations coordinate rescue efforts and bring children home safely.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Recent Active Cases</h2>
            <Button asChild variant="outline">
              <Link href="/cases">
                View All Cases
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCases.map((case_item: any) => (
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
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{case_item.child_name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span>Age: {case_item.age || "Unknown"}</span>
                    <span className="capitalize">{case_item.gender}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{case_item.last_seen_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(case_item.last_seen_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
                    <Link href={`/cases/${case_item.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Every Second Counts</h2>
          <p className="text-xl mb-8 text-blue-100 text-pretty">
            Join our community of caring individuals helping to bring missing children home. Your eyes and vigilance can
            make the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/photo-match">Try Photo Matching</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/cases">Browse Cases</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
