import { NextResponse } from "next/server"
import { getFeaturedItems } from "@/lib/items"

export async function GET() {
  try {
    const items = await getFeaturedItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching featured items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
