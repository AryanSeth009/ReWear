import { type NextRequest, NextResponse } from "next/server"
import { getItemById } from "@/lib/items"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    const item = await getItemById(params.id, user?._id)

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
}
