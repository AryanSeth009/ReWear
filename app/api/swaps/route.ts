import { type NextRequest, NextResponse } from "next/server"
import { createSwapRequest, getSwapsByUser, updateSwapStatus } from "@/lib/swaps"
import { verifyToken } from "@/lib/auth"

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

    const swaps = await getSwapsByUser(decoded.userId)
    return NextResponse.json(swaps)
  } catch (error) {
    console.error("Error fetching swaps:", error)
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
    const swap = await createSwapRequest({
      ...body,
      requesterId: decoded.userId,
    })

    return NextResponse.json(swap, { status: 201 })
  } catch (error) {
    console.error("Error creating swap:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { swapId, status } = await request.json()
    await updateSwapStatus(swapId, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating swap:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
