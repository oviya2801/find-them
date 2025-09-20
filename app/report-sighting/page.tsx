"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, MapPin, User, Phone } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function ReportSightingPage() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get("case")

  const [formData, setFormData] = useState({
    case_id: caseId || "",
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
    sighting_location: "",
    sighting_date: "",
    sighting_time: "",
    description: "",
    confidence_level: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/sightings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        throw new Error("Failed to submit sighting")
      }
    } catch (error) {
      console.error("Error submitting sighting:", error)
      alert("There was an error submitting your sighting. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Sighting Reported Successfully</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Thank you for your report. Our team will review the information and follow up if needed.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <a href="/cases">Browse More Cases</a>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href="/report-sighting">Report Another Sighting</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Report a Sighting</h1>
          <p className="text-gray-600 text-lg">
            Your information could help bring a missing child home. Please provide as much detail as possible.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sighting Information</CardTitle>
                <CardDescription>
                  All fields marked with * are required. Your contact information will be kept confidential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Case Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="case_id">Case Number *</Label>
                    <Input
                      id="case_id"
                      placeholder="Enter case number or search by child name"
                      value={formData.case_id}
                      onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                      required
                    />
                  </div>

                  {/* Reporter Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Your Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reporter_name">Full Name *</Label>
                        <Input
                          id="reporter_name"
                          value={formData.reporter_name}
                          onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reporter_phone">Phone Number *</Label>
                        <Input
                          id="reporter_phone"
                          type="tel"
                          value={formData.reporter_phone}
                          onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reporter_email">Email Address *</Label>
                      <Input
                        id="reporter_email"
                        type="email"
                        value={formData.reporter_email}
                        onChange={(e) => setFormData({ ...formData, reporter_email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Sighting Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Sighting Details
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="sighting_location">Location of Sighting *</Label>
                      <Input
                        id="sighting_location"
                        placeholder="Be as specific as possible (address, landmarks, etc.)"
                        value={formData.sighting_location}
                        onChange={(e) => setFormData({ ...formData, sighting_location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sighting_date">Date of Sighting *</Label>
                        <Input
                          id="sighting_date"
                          type="date"
                          value={formData.sighting_date}
                          onChange={(e) => setFormData({ ...formData, sighting_date: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sighting_time">Approximate Time</Label>
                        <Input
                          id="sighting_time"
                          type="time"
                          value={formData.sighting_time}
                          onChange={(e) => setFormData({ ...formData, sighting_time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence_level">How confident are you? *</Label>
                      <Select
                        value={formData.confidence_level}
                        onValueChange={(value) => setFormData({ ...formData, confidence_level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select confidence level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Not very confident</SelectItem>
                          <SelectItem value="2">2 - Somewhat confident</SelectItem>
                          <SelectItem value="3">3 - Moderately confident</SelectItem>
                          <SelectItem value="4">4 - Very confident</SelectItem>
                          <SelectItem value="5">5 - Extremely confident</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what you saw, what the child was wearing, who they were with, their behavior, etc."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Sighting Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Reporting Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be as specific as possible with location and time details</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include any distinguishing features you noticed</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Note if the child appeared to be in distress or danger</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Describe anyone the child was with</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Situation?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">If you believe a child is in immediate danger:</p>
                <Button variant="destructive" className="w-full mb-2">
                  <Phone className="mr-2 h-4 w-4" />
                  Call 911 Now
                </Button>
                <p className="text-xs text-red-600">Then return to complete this form for our records.</p>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Confidentiality</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>
                  Your contact information will only be used by authorized personnel to follow up on this sighting if
                  needed. We take your privacy seriously and will never share your information publicly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
