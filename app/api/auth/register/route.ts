import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { organization, user } = await request.json()

    // Validate required fields
    if (!organization.name || !organization.type || !organization.contact_email) {
      return NextResponse.json({ success: false, error: "Missing required organization fields" }, { status: 400 })
    }

    if (!user.name || !user.email || !user.role) {
      return NextResponse.json({ success: false, error: "Missing required user fields" }, { status: 400 })
    }

    // Start transaction
    try {
      // Create organization
      const orgResult = await sql(
        `
        INSERT INTO organizations (name, type, contact_email, contact_phone, address, verification_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
        [
          organization.name,
          organization.type,
          organization.contact_email,
          organization.contact_phone || null,
          organization.address || null,
          "pending", // New organizations need verification
        ],
      )

      const organizationId = orgResult[0].id

      // Create user
      await sql(
        `
        INSERT INTO platform_users (email, name, role, organization_id, phone, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          user.email,
          user.name,
          user.role,
          organizationId,
          user.phone || null,
          false, // New users need verification
        ],
      )

      return NextResponse.json({
        success: true,
        message: "Registration submitted successfully. Your account will be reviewed and verified.",
      })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      if (dbError.code === "23505") {
        // Unique constraint violation
        return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 })
      }
      throw dbError
    }
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
