import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  bio?: string
  points: number
  location?: string
  rating: number
  totalSwaps: number
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(userId: string): Promise<string> {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch {
    return null
  }
}

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const db = await getDatabase()
  const users = db.collection("users")

  // Check if user already exists
  const existingUser = await users.findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(password)

  const newUser = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    points: 50, // Welcome bonus
    rating: 5.0,
    totalSwaps: 0,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await users.insertOne(newUser)
  const token = await generateToken(result.insertedId.toString())

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { user: { ...newUser, _id: result.insertedId.toString() }, token }
}

export async function signIn(email: string, password: string) {
  const db = await getDatabase()
  const users = db.collection("users")

  const user = await users.findOne({ email })
  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  const token = await generateToken(user._id.toString())

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const { password: _, ...userWithoutPassword } = user
  return { user: { ...userWithoutPassword, _id: user._id.toString() }, token }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const decoded = await verifyToken(token)
    if (!decoded) return null

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) return null

    const { password: _, ...userWithoutPassword } = user
    return { ...userWithoutPassword, _id: user._id.toString() } as User
  } catch {
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const db = await getDatabase()
  const users = db.collection("users")

  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result) throw new Error("User not found")

  const { password: _, ...userWithoutPassword } = result
  return { ...userWithoutPassword, _id: result._id.toString() } as User
}
