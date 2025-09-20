import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/database"

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

    // Create the case
    const result = await sql(
      `
      INSERT INTO cases (
        child_name, age, gender, description, last_seen_location, last_seen_date,
        case_number, status, priority, organization_id, created_by, additional_info
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `,
      [
        body.child_name,
        body.age ? Number.parseInt(body.age) : null,
        body.gender || null,
        body.description,
        body.last_seen_location,
        body.last_seen_date,
        caseNumber,
        "active",
        body.priority || "medium",
        user.organization_id,
        user.id,
        JSON.stringify(body.additional_info || {}),
      ],
    )

    return NextResponse.json({ success: true, case: result[0] })
  } catch (error) {
    console.error("Error creating case:", error)
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 })
  }
}
