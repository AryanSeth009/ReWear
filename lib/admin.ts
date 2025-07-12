import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function getAdminStats() {
  const db = await getDatabase()

  const [totalUsers, totalItems, pendingItems, completedSwaps, totalReports] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("items").countDocuments(),
    db.collection("items").countDocuments({ status: "pending" }),
    db.collection("swaps").countDocuments({ status: "completed" }),
    db.collection("reports").countDocuments(),
  ])

  return {
    totalUsers,
    totalItems,
    pendingItems,
    completedSwaps,
    totalReports,
  }
}

export async function getPendingItems() {
  const db = await getDatabase()

  const items = await db
    .collection("items")
    .aggregate([
      { $match: { status: "pending" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          condition: 1,
          images: 1,
          points: 1,
          createdAt: 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.email": 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray()

  return items.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }))
}

export async function approveItem(itemId: string): Promise<void> {
  const db = await getDatabase()

  const item = await db.collection("items").findOne({ _id: new ObjectId(itemId) })
  if (!item) throw new Error("Item not found")

  await db.collection("items").updateOne({ _id: new ObjectId(itemId) }, { $set: { status: "approved" } })

  // Award points to user for approved item
  await db.collection("users").updateOne({ _id: item.userId }, { $inc: { points: 10 } })
}

export async function rejectItem(itemId: string): Promise<void> {
  const db = await getDatabase()

  await db.collection("items").updateOne({ _id: new ObjectId(itemId) }, { $set: { status: "rejected" } })
}
