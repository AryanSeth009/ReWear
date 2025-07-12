import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  points: number
  rating: number
  isAdmin: boolean
  createdAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDatabase()
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

  if (!user) return null

  return {
    _id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    points: user.points || 0,
    rating: user.rating || 0,
    isAdmin: user.isAdmin || false,
    createdAt: user.createdAt,
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<User> {
  const db = await getDatabase()
  const hashedPassword = await hashPassword(userData.password)

  const result = await db.collection("users").insertOne({
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    points: 100, // Welcome bonus
    rating: 0,
    isAdmin: false,
    createdAt: new Date(),
  })

  return {
    _id: result.insertedId.toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    points: 100,
    rating: 0,
    isAdmin: false,
    createdAt: new Date(),
  }
}

export async function signUp(email: string, password: string, firstName: string, lastName: string): Promise<User> {
  const db = await getDatabase()
  
  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  return createUser({ email, password, firstName, lastName })
}

export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  const db = await getDatabase()
  
  const user = await db.collection("users").findOne({ email })
  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  const userData = {
    _id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    points: user.points || 0,
    rating: user.rating || 0,
    isAdmin: user.isAdmin || false,
    createdAt: user.createdAt,
  }

  const token = generateToken(user._id.toString())
  
  return { user: userData, token }
}

export async function signOut(): Promise<void> {
  // In a real application, you might want to invalidate the token
  // For now, we'll just return successfully
  return Promise.resolve()
}
