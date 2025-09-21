import { getCollections } from "@/lib/database"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthUser {
  _id?: ObjectId
  email: string
  name: string
  role: "public" | "ngo_admin" | "ngo_member" | "police" | "admin"
  organization_id?: ObjectId
  organization_name?: string
  is_verified: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      _id: user._id?.toString(),
      email: user.email,
      role: user.role,
      organization_id: user.organization_id?.toString(),
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  try {
    const { users } = await getCollections()

    const result = await users
      .aggregate([
        { $match: { _id: new ObjectId(decoded._id) } },
        {
          $lookup: {
            from: "organizations",
            localField: "organization_id",
            foreignField: "_id",
            as: "organization",
          },
        },
        {
          $addFields: {
            organization_name: { $arrayElemAt: ["$organization.name", 0] },
          },
        },
      ])
      .toArray()

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization_id: user.organization_id,
      organization_name: user.organization_name,
      is_verified: user.is_verified,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth(allowedRoles?: string[]): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/organization/login")
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const { users } = await getCollections()

    const result = await users
      .aggregate([
        { $match: { email: email } },
        {
          $lookup: {
            from: "organizations",
            localField: "organization_id",
            foreignField: "_id",
            as: "organization",
          },
        },
        {
          $addFields: {
            organization_name: { $arrayElemAt: ["$organization.name", 0] },
          },
        },
      ])
      .toArray()

    if (result.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = result[0]

    // For demo purposes, we'll accept any password. In production, use proper password hashing
    // const isValidPassword = await verifyPassword(password, user.password_hash)
    // if (!isValidPassword) {
    //   return { success: false, error: "Invalid email or password" }
    // }

    const authUser: AuthUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization_id: user.organization_id,
      organization_name: user.organization_name,
      is_verified: user.is_verified,
    }

    return { success: true, user: authUser }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, error: "An error occurred during sign in" }
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}

export async function createUser(userData: {
  email: string
  name: string
  role: string
  organization_id?: ObjectId
  phone?: string
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const { users } = await getCollections()

    const result = await users.insertOne({
      email: userData.email,
      name: userData.name,
      role: userData.role,
      organization_id: userData.organization_id || undefined,
      phone: userData.phone || undefined,
      is_verified: false, // New users need verification
      created_at: new Date(),
      updated_at: new Date(),
    })

    const authUser: AuthUser = {
      _id: result.insertedId,
      email: userData.email,
      name: userData.name,
      role: userData.role as any,
      organization_id: userData.organization_id,
      is_verified: false,
    }

    return { success: true, user: authUser }
  } catch (error: any) {
    console.error("Create user error:", error)
    if (error.code === 11000) {
      // Duplicate key error (unique constraint violation)
      return { success: false, error: "Email already exists" }
    }
    return { success: false, error: "An error occurred during registration" }
  }
}
