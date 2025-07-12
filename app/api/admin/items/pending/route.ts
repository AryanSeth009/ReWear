import { NextResponse } from "next/server"
import { getPendingItems } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const items = await getPendingItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching pending items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
