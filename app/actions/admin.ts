"use server"

import { approveItem, rejectItem, removeItem } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"

export async function approveItemAction(itemId: string) {
  const user = await getCurrentUser()
  if (!user?.isAdmin) throw new Error("Not authorized")

  try {
    const item = await approveItem(itemId, user._id)
    return { success: true, item }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function rejectItemAction(itemId: string, reason: string) {
  const user = await getCurrentUser()
  if (!user?.isAdmin) throw new Error("Not authorized")

  try {
    const item = await rejectItem(itemId, reason, user._id)
    return { success: true, item }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function removeItemAction(itemId: string) {
  const user = await getCurrentUser()
  if (!user?.isAdmin) throw new Error("Not authorized")

  try {
    await removeItem(itemId, user._id)
    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
