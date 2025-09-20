"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MapPin, AlertTriangle, FileText } from "lucide-react"

export default function NewCasePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    child_name: "",
    age: "",
    gender: "",
    description: "",
    last_seen_location: "",
    last_seen_date: "",
    priority: "medium",
    additional_info: {
      height: "",
      weight: "",
      hair_color: "",
      eye_color: "",
      distinguishing_marks: "",
      clothing_description: "",
      last_seen_with: "",
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/organization/dashboard/cases/${data.case.id}`)
      } else {
        setError(data.error || "Failed to create case")
      }
    } catch (error) {
      setError("An error occurred while creating the case")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Case</h1>
        <p className="text-gray-600">Add a new missing child case to your organization</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Essential details about the missing child</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="child_name">Child's Full Name *</Label>
                  <Input
                    id="child_name"
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="18"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">General Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the child's appearance, personality, and any other relevant details..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Last Seen Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Last Seen Information
              </CardTitle>
              <CardDescription>When and where the child was last seen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="last_seen_location">Last Seen Location *</Label>
                <Input
                  id="last_seen_location"
                  placeholder="Be as specific as possible (address, landmarks, etc.)"
                  value={formData.last_seen_location}
                  onChange={(e) => setFormData({ ...formData, last_seen_location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_seen_date">Last Seen Date *</Label>
                <Input
                  id="last_seen_date"
                  type="date"
                  value={formData.last_seen_date}
                  onChange={(e) => setFormData({ ...formData, last_seen_date: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Details
              </CardTitle>
              <CardDescription>Physical characteristics and other identifying information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    placeholder="e.g., 4'2&quot; or 127cm"
                    value={formData.additional_info.height}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional_info: { ...formData.additional_info, height: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 65 lbs or 30kg"
                    value={formData.additional_info.weight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional_info: { ...formData.additional_info, weight: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hair_color">Hair Color</Label>
                  <Input
                    id="hair_color"
                    placeholder="e.g., Brown, Blonde, Black"
                    value={formData.additional_info.hair_color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional_info: { ...formData.additional_info, hair_color: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eye_color">Eye Color</Label>
                  <Input
                    id="eye_color"
                    placeholder="e.g., Brown, Blue, Green"
                    value={formData.additional_info.eye_color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional_info: { ...formData.additional_info, eye_color: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distinguishing_marks">Distinguishing Marks</Label>
                <Textarea
                  id="distinguishing_marks"
                  placeholder="Scars, birthmarks, tattoos, or other unique features..."
                  rows={2}
                  value={formData.additional_info.distinguishing_marks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additional_info: { ...formData.additional_info, distinguishing_marks: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clothing_description">Clothing Description</Label>
                <Textarea
                  id="clothing_description"
                  placeholder="What was the child wearing when last seen..."
                  rows={2}
                  value={formData.additional_info.clothing_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additional_info: { ...formData.additional_info, clothing_description: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_seen_with">Last Seen With</Label>
                <Input
                  id="last_seen_with"
                  placeholder="People, pets, or items the child was with..."
                  value={formData.additional_info.last_seen_with}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additional_info: { ...formData.additional_info, last_seen_with: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Case Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Case Priority
              </CardTitle>
              <CardDescription>Set the urgency level for this case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Standard case</SelectItem>
                    <SelectItem value="medium">Medium - Elevated concern</SelectItem>
                    <SelectItem value="high">High - Serious concern</SelectItem>
                    <SelectItem value="urgent">Urgent - Immediate danger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Creating Case..." : "Create Case"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
