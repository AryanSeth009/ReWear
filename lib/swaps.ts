import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface Swap {
  _id: string
  requesterId: string
  ownerId: string
  requesterItemId?: string
  ownerItemId: string
  message: string
  status: "pending" | "approved" | "rejected" | "completed"
  type: "swap" | "redeem"
  pointsUsed?: number
  createdAt: Date
  updatedAt: Date
  requester?: any
  owner?: any
  requesterItem?: any
  ownerItem?: any
}

export async function createSwapRequest(swap: Omit<Swap, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const swaps = db.collection("swaps")

  const newSwap = {
    ...swap,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await swaps.insertOne(newSwap)
  return { ...newSwap, _id: result.insertedId.toString() }
}

export async function getUserSwaps(userId: string) {
  const db = await getDatabase()
  const swaps = db.collection("swaps")

  const pipeline = [
    {
      $match: {
        $or: [{ requesterId: userId }, { ownerId: userId }],
      },
    },
    {
      $lookup: {
        from: "users",
        let: { requesterId: { $toObjectId: "$requesterId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$requesterId"] } } }, { $project: { password: 0 } }],
        as: "requester",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { ownerId: { $toObjectId: "$ownerId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } }, { $project: { password: 0 } }],
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "items",
        let: { ownerItemId: { $toObjectId: "$ownerItemId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$ownerItemId"] } } }],
        as: "ownerItem",
      },
    },
    {
      $lookup: {
        from: "items",
        let: { requesterItemId: { $toObjectId: "$requesterItemId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$requesterItemId"] } } }],
        as: "requesterItem",
      },
    },
    { $unwind: "$requester" },
    { $unwind: "$owner" },
    { $unwind: "$ownerItem" },
    {
      $unwind: {
        path: "$requesterItem",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: -1 } },
  ]

  const result = await swaps.aggregate(pipeline).toArray()

  return result.map((swap) => ({
    ...swap,
    _id: swap._id.toString(),
    requester: {
      ...swap.requester,
      _id: swap.requester._id.toString(),
    },
    owner: {
      ...swap.owner,
      _id: swap.owner._id.toString(),
    },
    ownerItem: {
      ...swap.ownerItem,
      _id: swap.ownerItem._id.toString(),
    },
    requesterItem: swap.requesterItem
      ? {
          ...swap.requesterItem,
          _id: swap.requesterItem._id.toString(),
        }
      : undefined,
  })) as Swap[]
}

export async function updateSwapStatus(swapId: string, status: "approved" | "rejected" | "completed", userId: string) {
  const db = await getDatabase()
  const swaps = db.collection("swaps")
  const items = db.collection("items")
  const users = db.collection("users")

  // Get the swap details first
  const swap = await swaps.findOne({ _id: new ObjectId(swapId) })
  if (!swap) throw new Error("Swap not found")

  // Update swap status
  await swaps.updateOne(
    { _id: new ObjectId(swapId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )

  if (status === "completed") {
    // Mark items as unavailable
    await items.updateOne(
      { _id: new ObjectId(swap.ownerItemId) },
      {
        $set: {
          available: false,
          status: swap.type === "redeem" ? "redeemed" : "swapped",
          updatedAt: new Date(),
        },
      },
    )

    if (swap.requesterItemId) {
      await items.updateOne(
        { _id: new ObjectId(swap.requesterItemId) },
        {
          $set: {
            available: false,
            status: "swapped",
            updatedAt: new Date(),
          },
        },
      )
    }

    // Update user points and swap counts
    if (swap.type === "redeem") {
      // Deduct points from requester, add points to owner
      await users.updateOne(
        { _id: new ObjectId(swap.requesterId) },
        {
          $inc: { points: -swap.pointsUsed },
          $set: { updatedAt: new Date() },
        },
      )

      await users.updateOne(
        { _id: new ObjectId(swap.ownerId) },
        {
          $inc: { points: swap.pointsUsed },
          $set: { updatedAt: new Date() },
        },
      )
    } else {
      // Add points to both users for successful swap
      await users.updateOne(
        { _id: new ObjectId(swap.requesterId) },
        {
          $inc: { points: 10 },
          $set: { updatedAt: new Date() },
        },
      )

      await users.updateOne(
        { _id: new ObjectId(swap.ownerId) },
        {
          $inc: { points: 10 },
          $set: { updatedAt: new Date() },
        },
      )
    }

    // Increment swap counts
    await users.updateOne(
      { _id: new ObjectId(swap.requesterId) },
      {
        $inc: { totalSwaps: 1 },
        $set: { updatedAt: new Date() },
      },
    )

    await users.updateOne(
      { _id: new ObjectId(swap.ownerId) },
      {
        $inc: { totalSwaps: 1 },
        $set: { updatedAt: new Date() },
      },
    )
  }

  return swap
}

export async function redeemWithPoints(userId: string, itemId: string, points: number) {
  const db = await getDatabase()
  const items = db.collection("items")

  const item = await items.findOne({ _id: new ObjectId(itemId) })
  if (!item) throw new Error("Item not found")

  const swap = await createSwapRequest({
    requesterId: userId,
    ownerId: item.userId,
    ownerItemId: itemId,
    message: "Point redemption",
    type: "redeem",
    pointsUsed: points,
    status: "approved", // Auto-approve point redemptions
  })

  // Complete the redemption immediately
  await updateSwapStatus(swap._id, "completed", userId)

  return swap
}
