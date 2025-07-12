import { type NextRequest, NextResponse } from "next/server"
import { getItemById, updateItemViews, likeItem } from "@/lib/items"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await getItemById(params.id)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Update view count
    await updateItemViews(params.id)

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === "like") {
      await likeItem(params.id, decoded.userId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
