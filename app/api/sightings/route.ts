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

    // Create the sighting
    const sighting = await createSighting({
      case_id: Number.parseInt(body.case_id),
      reporter_name: body.reporter_name,
      reporter_email: body.reporter_email,
      reporter_phone: body.reporter_phone,
      sighting_location: body.sighting_location,
      sighting_date: body.sighting_date,
      sighting_time: body.sighting_time || null,
      description: body.description,
      confidence_level: body.confidence_level ? Number.parseInt(body.confidence_level) : null,
      status: "pending",
    })

    return NextResponse.json({ success: true, sighting })
  } catch (error) {
    console.error("Error creating sighting:", error)
    return NextResponse.json({ error: "Failed to create sighting" }, { status: 500 })
  }
}
