"use server"

import { redirect } from "next/navigation"
import { createItem, deleteItem, toggleLike } from "@/lib/items"
import { getCurrentUser } from "@/lib/auth"

export async function createItemAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const size = formData.get("size") as string
  const condition = formData.get("condition") as string
  const tags =
    (formData.get("tags") as string)
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || []

  // Calculate points based on condition and category
  const basePoints =
    {
      Tops: 15,
      Bottoms: 20,
      Dresses: 25,
      Outerwear: 35,
      Footwear: 30,
      Accessories: 10,
    }[category] || 15

  const conditionMultiplier =
    {
      "Like New": 1.5,
      Excellent: 1.3,
      Good: 1.0,
      Fair: 0.7,
    }[condition] || 1.0

  const points = Math.round(basePoints * conditionMultiplier)

  try {
    const item = await createItem({
      userId: user._id,
      title,
      description,
      category,
      type,
      size,
      condition,
      points,
      tags,
      images: [], // TODO: Handle image upload
      status: "pending",
      available: true,
    })

    redirect("/dashboard")
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function toggleLikeAction(itemId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  try {
    const isLiked = await toggleLike(user._id, itemId)
    return { success: true, isLiked }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function deleteItemAction(itemId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  try {
    await deleteItem(itemId)
    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
