import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface Item {
  _id: string
  userId: string
  title: string
  description: string
  category: string
  type: string
  size: string
  condition: string
  points: number
  tags: string[]
  images: string[]
  status: "pending" | "approved" | "rejected" | "swapped" | "redeemed"
  views: number
  likes: number
  available: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    rating: number
    totalSwaps: number
    location?: string
  }
  isLiked?: boolean
}

export async function getItems(filters?: {
  category?: string
  condition?: string
  size?: string
  search?: string
  userId?: string
  status?: string
}) {
  const db = await getDatabase()
  const items = db.collection("items")

  const query: any = {}

  if (filters?.category && filters.category !== "all") {
    query.category = filters.category
  }

  if (filters?.condition && filters.condition !== "all") {
    query.condition = filters.condition
  }

  if (filters?.size && filters.size !== "all") {
    query.size = filters.size
  }

  if (filters?.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ]
  }

  if (filters?.userId) {
    query.userId = filters.userId
  }

  if (filters?.status) {
    query.status = filters.status
  } else {
    query.status = "approved"
    query.available = true
  }

  const pipeline = [
    { $match: query },
    {
      $lookup: {
        from: "users",
        let: { userId: { $toObjectId: "$userId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, { $project: { password: 0 } }],
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
  })) as Item[]
}

export async function getItemById(id: string, userId?: string) {
  const db = await getDatabase()
  const items = db.collection("items")

  // Increment view count
  await items.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })

  const pipeline = [
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        let: { userId: { $toObjectId: "$userId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, { $project: { password: 0 } }],
        as: "user",
      },
    },
    { $unwind: "$user" },
  ]

  const result = await items.aggregate(pipeline).toArray()
  if (result.length === 0) throw new Error("Item not found")

  const item = result[0]

  // Check if user has liked this item
  let isLiked = false
  if (userId) {
    const likes = db.collection("likes")
    const like = await likes.findOne({ userId, itemId: id })
    isLiked = !!like
  }

  return {
    ...item,
    _id: item._id.toString(),
    user: {
      ...item.user,
      _id: item.user._id.toString(),
    },
    isLiked,
  } as Item
}

export async function createItem(item: Omit<Item, "_id" | "views" | "likes" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const items = db.collection("items")

  const newItem = {
    ...item,
    views: 0,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await items.insertOne(newItem)
  return { ...newItem, _id: result.insertedId.toString() }
}

export async function updateItem(id: string, updates: Partial<Item>) {
  const db = await getDatabase()
  const items = db.collection("items")

  const result = await items.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result) throw new Error("Item not found")
  return { ...result, _id: result._id.toString() }
}

export async function deleteItem(id: string) {
  const db = await getDatabase()
  const items = db.collection("items")

  const result = await items.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0) throw new Error("Item not found")
}

export async function toggleLike(userId: string, itemId: string) {
  const db = await getDatabase()
  const likes = db.collection("likes")
  const items = db.collection("items")

  const existingLike = await likes.findOne({ userId, itemId })

  if (existingLike) {
    // Unlike
    await likes.deleteOne({ userId, itemId })
    await items.updateOne({ _id: new ObjectId(itemId) }, { $inc: { likes: -1 } })
    return false
  } else {
    // Like
    await likes.insertOne({
      userId,
      itemId,
      createdAt: new Date(),
    })
    await items.updateOne({ _id: new ObjectId(itemId) }, { $inc: { likes: 1 } })
    return true
  }
}

export async function getFeaturedItems() {
  const db = await getDatabase()
  const items = db.collection("items")

  const pipeline = [
    {
      $match: {
        status: "approved",
        available: true,
      },
    },
    {
      $lookup: {
        from: "users",
        let: { userId: { $toObjectId: "$userId" } },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, { $project: { firstName: 1, lastName: 1 } }],
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $sort: { likes: -1 } },
    { $limit: 4 },
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
