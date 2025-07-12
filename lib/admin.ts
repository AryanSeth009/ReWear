import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function getPendingItems() {
  const db = await getDatabase()
  const items = db.collection("items")

  const pipeline = [
    { $match: { status: "pending" } },
    {
      $lookup: {
        from: "users",
        let: { userId: { $toObjectId: "$userId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
          { $project: { firstName: 1, lastName: 1, email: 1 } },
        ],
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $sort: { createdAt: -1 } },
  ]

  const result = await items.aggregate(pipeline).toArray()

  return result.map((item) => ({
    ...item,
    _id: item._id.toString(),
    user: {
      ...item.user,
      _id: item.user._id.toString(),
    },
  }))
}

export async function getReportedItems() {
  const db = await getDatabase()
  const reports = db.collection("reports")

  const pipeline = [
    { $match: { status: "pending" } },
    {
      $lookup: {
        from: "items",
        let: { itemId: { $toObjectId: "$itemId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$itemId"] } } }],
        as: "item",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { reporterId: { $toObjectId: "$reporterId" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$reporterId"] } } },
          { $project: { firstName: 1, lastName: 1 } },
        ],
        as: "reporter",
      },
    },
    { $unwind: "$item" },
    { $unwind: "$reporter" },
    { $sort: { createdAt: -1 } },
  ]

  const result = await reports.aggregate(pipeline).toArray()

  return result.map((report) => ({
    ...report,
    _id: report._id.toString(),
    item: {
      ...report.item,
      _id: report.item._id.toString(),
    },
    reporter: {
      ...report.reporter,
      _id: report.reporter._id.toString(),
    },
  }))
}

export async function approveItem(itemId: string, adminId: string) {
  const db = await getDatabase()
  const items = db.collection("items")
  const users = db.collection("users")

  // Get item details first
  const item = await items.findOne({ _id: new ObjectId(itemId) })
  if (!item) throw new Error("Item not found")

  // Update item status
  const result = await items.findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    {
      $set: {
        status: "approved",
        available: true,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  // Award points to user for approved item
  await users.updateOne(
    { _id: new ObjectId(item.userId) },
    {
      $inc: { points: Math.floor(item.points * 0.5) }, // 50% of item value as reward
      $set: { updatedAt: new Date() },
    },
  )

  return { ...result, _id: result!._id.toString() }
}

export async function rejectItem(itemId: string, reason: string, adminId: string) {
  const db = await getDatabase()
  const items = db.collection("items")

  const result = await items.findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    {
      $set: {
        status: "rejected",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result) throw new Error("Item not found")
  return { ...result, _id: result._id.toString() }
}

export async function removeItem(itemId: string, adminId: string) {
  const db = await getDatabase()
  const items = db.collection("items")

  const result = await items.deleteOne({ _id: new ObjectId(itemId) })
  if (result.deletedCount === 0) throw new Error("Item not found")
}

export async function getAdminStats() {
  const db = await getDatabase()

  const [usersCount, itemsCount, completedSwaps, pendingReports] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("items").countDocuments(),
    db.collection("swaps").countDocuments({ status: "completed" }),
    db.collection("reports").countDocuments({ status: "pending" }),
  ])

  return {
    totalUsers: usersCount,
    totalItems: itemsCount,
    completedSwaps,
    pendingReports,
  }
}
