"use server"

import { createSwapRequest, updateSwapStatus, redeemWithPoints } from "@/lib/swaps"
import { getCurrentUser } from "@/lib/auth"

export async function createSwapAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const ownerId = formData.get("ownerId") as string
  const ownerItemId = formData.get("ownerItemId") as string
  const requesterItemId = formData.get("requesterItemId") as string | null
  const message = formData.get("message") as string
  const type = formData.get("type") as "swap" | "redeem"

  try {
    const swap = await createSwapRequest({
      requesterId: user._id,
      ownerId,
      ownerItemId,
      requesterItemId: requesterItemId || undefined,
      message,
      type,
      status: "pending",
    })

    return { success: true, swap }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function updateSwapAction(swapId: string, status: "approved" | "rejected" | "completed") {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  try {
    const swap = await updateSwapStatus(swapId, status, user._id)
    return { success: true, swap }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function redeemItemAction(itemId: string, points: number) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  if (user.points < points) {
    throw new Error("Insufficient points")
  }

  try {
    const swap = await redeemWithPoints(user._id, itemId, points)
    return { success: true, swap }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
