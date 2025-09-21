import { type NextRequest, NextResponse } from "next/server"
import { createSighting } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "case_id",
      "reporter_name",
      "reporter_email",
      "reporter_phone",
      "sighting_location",
      "sighting_date",
      "description",
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const sighting = await createSighting({
      case_id: body.case_id, // MongoDB ObjectId as string
      reporter_name: body.reporter_name,
      reporter_email: body.reporter_email,
      reporter_phone: body.reporter_phone,
      sighting_location: body.sighting_location,
      sighting_date: new Date(body.sighting_date), // Convert to Date object
      sighting_time: body.sighting_time || undefined,
      description: body.description,
      confidence_level: body.confidence_level ? Number.parseInt(body.confidence_level) : undefined,
      status: "pending",
    })

    return NextResponse.json({ success: true, sighting })
  } catch (error) {
    console.error("Error creating sighting:", error)
    return NextResponse.json({ error: "Failed to create sighting" }, { status: 500 })
  }
}
