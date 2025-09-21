import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createCase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !["ngo_admin", "ngo_member", "police", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["child_name", "description", "last_seen_location", "last_seen_date"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate case number
    const caseNumber = `${user.organization_id}-${Date.now()}`

    const newCase = await createCase({
      child_name: body.child_name,
      age: body.age ? Number.parseInt(body.age) : undefined,
      gender: body.gender || undefined,
      description: body.description,
      last_seen_location: body.last_seen_location,
      last_seen_date: new Date(body.last_seen_date),
      case_number: caseNumber,
      status: "active",
      priority: body.priority || "medium",
      organization_id: user.organization_id!,
      created_by: user._id!,
      additional_info: body.additional_info || {},
    })

    return NextResponse.json({ success: true, case: newCase })
  } catch (error) {
    console.error("Error creating case:", error)
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 })
  }
}
