import { type NextRequest, NextResponse } from "next/server"
import { getItems } from "@/lib/items"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      category: searchParams.get("category") || undefined,
      condition: searchParams.get("condition") || undefined,
      size: searchParams.get("size") || undefined,
      search: searchParams.get("search") || undefined,
      userId: searchParams.get("userId") || undefined,
      status: searchParams.get("status") || undefined,
    }

    const items = await getItems(filters)
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
