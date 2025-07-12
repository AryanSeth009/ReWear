import { type NextRequest, NextResponse } from "next/server"
import { getPendingItems, approveItem, rejectItem } from "@/lib/admin"
import { verifyToken, getUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await getUserById(decoded.userId)
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const items = await getPendingItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching pending items:", error)
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

    const user = await getUserById(decoded.userId)
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { itemId, action } = await request.json()

    if (action === "approve") {
      await approveItem(itemId)
    } else if (action === "reject") {
      await rejectItem(itemId)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating item status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
