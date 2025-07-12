import { NextResponse } from "next/server"
import { getAdminStats } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
