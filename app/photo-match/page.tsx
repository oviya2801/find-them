"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Search, AlertTriangle, CheckCircle, MapPin, Clock, Eye } from "lucide-react"
import Link from "next/link"

interface MatchResult {
  case_id: number
  child_name: string
  case_number: string
  photo_url: string
  similarity_score: number
  age?: number
  gender?: string
  last_seen_location?: string
  last_seen_date?: string
  priority: string
  status: string
}

export default function PhotoMatchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<MatchResult[]>([])
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setError("")
        setResults([])
      } else {
        setError("Please select a valid image file")
      }
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setError("")
      setResults([])
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const processPhoto = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    setError("")

    try {
      // Simulate processing steps
      const steps = [
        { message: "Uploading image...", progress: 20 },
        { message: "Analyzing facial features...", progress: 40 },
        { message: "Generating embeddings...", progress: 60 },
        { message: "Searching database...", progress: 80 },
        { message: "Ranking results...", progress: 100 },
      ]

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProgress(step.progress)
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("photo", selectedFile)

      const response = await fetch("/api/photo-match", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.matches || [])
      } else {
        setError(data.error || "Failed to process photo")
      }
    } catch (error) {
      console.error("Photo matching error:", error)
      setError("An error occurred while processing the photo")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High Match"
    if (score >= 0.6) return "Possible Match"
    return "Low Match"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Photo Matching</h1>
          <p className="text-gray-600 text-lg">
            Upload a photo to find similar missing children cases using advanced AI technology.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Photo
                </CardTitle>
                <CardDescription>Upload a clear photo of the person you're looking for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-gray-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">Drop your photo here</p>
                        <p className="text-sm text-gray-600">or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <Button onClick={processPhoto} disabled={!selectedFile || isProcessing} className="w-full">
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Matches
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-green-800">Photo Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Use clear, well-lit photos</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Face should be clearly visible</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Avoid blurry or pixelated images</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Recent photos work best</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  {results.length > 0
                    ? `Found ${results.length} potential matches`
                    : "Upload a photo to see matching results"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div key={result.case_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          {/* Photo */}
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={
                                result.photo_url ||
                                `/placeholder.svg?height=80&width=80&query=missing child ${result.child_name || "/placeholder.svg"}`
                              }
                              alt={result.child_name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{result.child_name}</h3>
                                <p className="text-sm text-gray-600">Case #{result.case_number}</p>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-medium ${getConfidenceColor(result.similarity_score)}`}>
                                  {Math.round(result.similarity_score * 100)}% Match
                                </div>
                                <Badge
                                  variant={result.similarity_score >= 0.8 ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {getConfidenceLabel(result.similarity_score)}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>Age: {result.age || "Unknown"}</span>
                              <span className="capitalize">{result.gender}</span>
                              <Badge
                                className={`${
                                  result.priority === "urgent"
                                    ? "bg-red-500"
                                    : result.priority === "high"
                                      ? "bg-orange-500"
                                      : result.priority === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`}
                              >
                                {result.priority}
                              </Badge>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{result.last_seen_location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {result.last_seen_date
                                    ? new Date(result.last_seen_date).toLocaleDateString()
                                    : "Unknown"}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/cases/${result.case_id}`}>
                                  <Eye className="mr-2 h-3 w-3" />
                                  View Case
                                </Link>
                              </Button>
                              <Button asChild size="sm">
                                <Link href={`/report-sighting?case=${result.case_id}`}>Report Sighting</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
                    <p className="text-gray-600">Upload a photo to start searching for similar cases.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How AI Photo Matching Works</CardTitle>
            <CardDescription>Understanding our advanced facial recognition technology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Photo</h3>
                <p className="text-sm text-gray-600">
                  Our system analyzes the uploaded photo and extracts facial features using advanced AI algorithms.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Compare Features</h3>
                <p className="text-sm text-gray-600">
                  The system compares facial features against our database of missing children cases.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Show Results</h3>
                <p className="text-sm text-gray-600">
                  Results are ranked by similarity score, with the most likely matches shown first.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy Notice:</strong> Uploaded photos are processed securely and are not stored permanently. We
            use this technology solely to help locate missing children and protect their privacy.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
