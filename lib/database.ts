import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Database types
export interface Organization {
  id: number
  name: string
  type: "ngo" | "police" | "government"
  contact_email: string
  contact_phone?: string
  address?: string
  verification_status: "pending" | "verified" | "rejected"
  created_at: string
  updated_at: string
}

export interface PlatformUser {
  id: number
  email: string
  name: string
  role: "public" | "ngo_admin" | "ngo_member" | "police" | "admin"
  organization_id?: number
  phone?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Case {
  id: number
  child_name: string
  age?: number
  gender?: "male" | "female" | "other"
  description?: string
  last_seen_location?: string
  last_seen_date?: string
  case_number?: string
  status: "active" | "found" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  organization_id: number
  created_by: number
  photo_urls?: string[]
  additional_info?: any
  created_at: string
  updated_at: string
}

export interface Sighting {
  id: number
  case_id: number
  reporter_name?: string
  reporter_email?: string
  reporter_phone?: string
  sighting_location: string
  sighting_date: string
  sighting_time?: string
  description?: string
  photo_urls?: string[]
  confidence_level?: number
  status: "pending" | "verified" | "false_positive"
  verified_by?: number
  created_at: string
  updated_at: string
}

// Database query functions
export async function getCases(filters?: {
  status?: string
  organization_id?: number
  limit?: number
}) {
  // Build the base query with optional WHERE conditions
  let query = "SELECT * FROM cases"
  const conditions: string[] = []
  const params: any[] = []

  if (filters?.status) {
    conditions.push("status = $" + (params.length + 1))
    params.push(filters.status)
  }

  if (filters?.organization_id) {
    conditions.push("organization_id = $" + (params.length + 1))
    params.push(filters.organization_id)
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ")
  }

  query += " ORDER BY created_at DESC"

  if (filters?.limit) {
    query += " LIMIT $" + (params.length + 1)
    params.push(filters.limit)
  }

  // Use sql.query for parameterized queries
  if (params.length > 0) {
    return await sql.query(query, params)
  } else {
    return await sql`SELECT * FROM cases ORDER BY created_at DESC`
  }
}

export async function getCaseById(id: number) {
  const result = await sql`SELECT * FROM cases WHERE id = ${id}`
  return result[0] || null
}

export async function getSightingsByCase(caseId: number) {
  return await sql`SELECT * FROM sightings WHERE case_id = ${caseId} ORDER BY created_at DESC`
}

export async function createSighting(sighting: Omit<Sighting, "id" | "created_at" | "updated_at">) {
  const result = await sql`
    INSERT INTO sightings (
      case_id, reporter_name, reporter_email, reporter_phone,
      sighting_location, sighting_date, sighting_time, description,
      photo_urls, confidence_level, status
    ) VALUES (
      ${sighting.case_id}, ${sighting.reporter_name}, ${sighting.reporter_email}, ${sighting.reporter_phone},
      ${sighting.sighting_location}, ${sighting.sighting_date}, ${sighting.sighting_time}, ${sighting.description},
      ${sighting.photo_urls}, ${sighting.confidence_level}, ${sighting.status}
    )
    RETURNING *
  `

  return result[0]
}

export async function getOrganizations() {
  return await sql`SELECT * FROM organizations WHERE verification_status = 'verified' ORDER BY name`
}
