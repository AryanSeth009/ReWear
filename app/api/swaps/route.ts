import { NextResponse } from "next/server"
import { getUserSwaps } from "@/lib/swaps"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const swaps = await getUserSwaps(user._id)
    return NextResponse.json(swaps)
  } catch (error) {
    console.error("Error fetching swaps:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
