import { type NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/database"

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

    try {
      const { organizations, users } = await getCollections()

      // Create organization
      const orgResult = await organizations.insertOne({
        name: organization.name,
        type: organization.type,
        contact_email: organization.contact_email,
        contact_phone: organization.contact_phone || undefined,
        address: organization.address || undefined,
        verification_status: "pending", // New organizations need verification
        created_at: new Date(),
        updated_at: new Date(),
      })

      const organizationId = orgResult.insertedId

      // Create user
      await users.insertOne({
        email: user.email,
        name: user.name,
        role: user.role,
        organization_id: organizationId,
        phone: user.phone || undefined,
        is_verified: false, // New users need verification
        created_at: new Date(),
        updated_at: new Date(),
      })

      return NextResponse.json({
        success: true,
        message: "Registration submitted successfully. Your account will be reviewed and verified.",
      })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      if (dbError.code === 11000) {
        // Duplicate key error (unique constraint violation)
        return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 })
      }
      throw dbError
    }
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
