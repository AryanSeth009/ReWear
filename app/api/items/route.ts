import { type NextRequest, NextResponse } from "next/server"
import { createItem, getItems } from "@/lib/items"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const condition = searchParams.get("condition") || undefined
    const size = searchParams.get("size") || undefined
    const search = searchParams.get("search") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const items = await getItems({
      category,
      condition,
      size,
      search,
      status: "approved",
      limit,
      skip: (page - 1) * limit,
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const item = await createItem({
      ...body,
      userId: decoded.userId,
      status: "pending",
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
