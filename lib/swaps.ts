import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface Swap {
  _id: string
  requesterId: string
  ownerId: string
  itemId: string
  offeredItemId?: string
  pointsOffered?: number
  status: "pending" | "accepted" | "rejected" | "completed"
  message?: string
  createdAt: Date
  updatedAt: Date
}

export async function createSwapRequest(swapData: {
  requesterId: string
  ownerId: string
  itemId: string
  offeredItemId?: string
  pointsOffered?: number
  message?: string
}): Promise<Swap> {
  const db = await getDatabase()

  const result = await db.collection("swaps").insertOne({
    ...swapData,
    requesterId: new ObjectId(swapData.requesterId),
    ownerId: new ObjectId(swapData.ownerId),
    itemId: new ObjectId(swapData.itemId),
    offeredItemId: swapData.offeredItemId ? new ObjectId(swapData.offeredItemId) : undefined,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    _id: result.insertedId.toString(),
    ...swapData,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function getSwapsByUser(userId: string): Promise<Swap[]> {
  const db = await getDatabase()

  const swaps = await db
    .collection("swaps")
    .find({
      $or: [{ requesterId: new ObjectId(userId) }, { ownerId: new ObjectId(userId) }],
    })
    .sort({ createdAt: -1 })
    .toArray()

  return swaps.map((swap) => ({
    ...swap,
    _id: swap._id.toString(),
    requesterId: swap.requesterId.toString(),
    ownerId: swap.ownerId.toString(),
    itemId: swap.itemId.toString(),
    offeredItemId: swap.offeredItemId?.toString(),
  }))
}

export async function updateSwapStatus(swapId: string, status: "accepted" | "rejected" | "completed"): Promise<void> {
  const db = await getDatabase()

  await db.collection("swaps").updateOne(
    { _id: new ObjectId(swapId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )

  if (status === "completed") {
    const swap = await db.collection("swaps").findOne({ _id: new ObjectId(swapId) })
    if (swap) {
      // Mark item as swapped
      await db.collection("items").updateOne({ _id: swap.itemId }, { $set: { status: "swapped" } })

      // Transfer points if it's a point-based swap
      if (swap.pointsOffered) {
        await db.collection("users").updateOne({ _id: swap.requesterId }, { $inc: { points: -swap.pointsOffered } })
        await db.collection("users").updateOne({ _id: swap.ownerId }, { $inc: { points: swap.pointsOffered } })
      }
    }
  }
}
