import { MongoClient, type Db, ObjectId } from "mongodb"

let client: MongoClient
let db: Db

// Initialize MongoDB connection
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    db = client.db("findthem")
  }
  return { client, db }
}

// Get database collections
export async function getCollections() {
  const { db } = await connectToDatabase()
  return {
    organizations: db.collection("organizations"),
    users: db.collection("users"),
    cases: db.collection("cases"),
    sightings: db.collection("sightings"),
    photoEmbeddings: db.collection("photo_embeddings"),
  }
}

// Database types (updated for MongoDB)
export interface Organization {
  _id?: ObjectId
  name: string
  type: "ngo" | "police" | "government"
  contact_email: string
  contact_phone?: string
  address?: string
  verification_status: "pending" | "verified" | "rejected"
  created_at: Date
  updated_at: Date
}

export interface PlatformUser {
  _id?: ObjectId
  email: string
  name: string
  role: "public" | "ngo_admin" | "ngo_member" | "police" | "admin"
  organization_id?: ObjectId
  phone?: string
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Case {
  _id?: ObjectId
  child_name: string
  age?: number
  gender?: "male" | "female" | "other"
  description?: string
  last_seen_location?: string
  last_seen_date?: Date
  case_number?: string
  status: "active" | "found" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  organization_id: ObjectId
  created_by: ObjectId
  photo_urls?: string[]
  additional_info?: any
  created_at: Date
  updated_at: Date
}

export interface Sighting {
  _id?: ObjectId
  case_id: ObjectId
  reporter_name?: string
  reporter_email?: string
  reporter_phone?: string
  sighting_location: string
  sighting_date: Date
  sighting_time?: string
  description?: string
  photo_urls?: string[]
  confidence_level?: number
  status: "pending" | "verified" | "false_positive"
  verified_by?: ObjectId
  created_at: Date
  updated_at: Date
}

// Database query functions
export async function getCases(filters?: {
  status?: string
  organization_id?: string
  limit?: number
}) {
  try {
    const { cases } = await getCollections()
    const limit = filters?.limit || 1000

    const query: any = {}

    if (filters?.status) {
      query.status = filters.status
    }

    if (filters?.organization_id) {
      query.organization_id = new ObjectId(filters.organization_id)
    }

    const result = await cases.find(query).sort({ created_at: -1 }).limit(limit).toArray()

    return result
  } catch (error) {
    console.error("Database error in getCases:", error)
    return []
  }
}

export async function getCaseById(id: string) {
  try {
    const { cases } = await getCollections()
    const result = await cases.findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    console.error("Database error in getCaseById:", error)
    return null
  }
}

export async function getSightingsByCase(caseId: string) {
  try {
    const { sightings } = await getCollections()
    const result = await sightings
      .find({ case_id: new ObjectId(caseId) })
      .sort({ created_at: -1 })
      .toArray()
    return result
  } catch (error) {
    console.error("Database error in getSightingsByCase:", error)
    return []
  }
}

export async function createSighting(sighting: Omit<Sighting, "_id" | "created_at" | "updated_at">) {
  try {
    const { sightings } = await getCollections()

    const newSighting = {
      ...sighting,
      case_id: new ObjectId(sighting.case_id),
      sighting_date: new Date(sighting.sighting_date),
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await sightings.insertOne(newSighting)
    return { ...newSighting, _id: result.insertedId }
  } catch (error) {
    console.error("Database error in createSighting:", error)
    throw new Error("Unable to create sighting. Please check your database connection.")
  }
}

export async function getOrganizations() {
  try {
    const { organizations } = await getCollections()
    const result = await organizations.find({ verification_status: "verified" }).sort({ name: 1 }).toArray()
    return result
  } catch (error) {
    console.error("Database error in getOrganizations:", error)
    return []
  }
}

export async function createCase(caseData: Omit<Case, "_id" | "created_at" | "updated_at">) {
  try {
    const { cases } = await getCollections()

    const newCase = {
      ...caseData,
      organization_id: new ObjectId(caseData.organization_id),
      created_by: new ObjectId(caseData.created_by),
      last_seen_date: caseData.last_seen_date ? new Date(caseData.last_seen_date) : undefined,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await cases.insertOne(newCase)
    return { ...newCase, _id: result.insertedId }
  } catch (error) {
    console.error("Database error in createCase:", error)
    throw new Error("Unable to create case. Please check your database connection.")
  }
}
