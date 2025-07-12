import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface Item {
  _id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  images: string[]
  points: number
  userId: string
  user?: {
    firstName: string
    lastName: string
    rating: number
  }
  status: "pending" | "approved" | "rejected" | "swapped"
  likes: number
  views: number
  createdAt: Date
  updatedAt: Date
}

export async function createItem(
  itemData: Omit<Item, "_id" | "likes" | "views" | "createdAt" | "updatedAt">,
): Promise<Item> {
  const db = await getDatabase()

  const result = await db.collection("items").insertOne({
    ...itemData,
    likes: 0,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    _id: result.insertedId.toString(),
    ...itemData,
    likes: 0,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function getItems(
  filters: {
    category?: string
    condition?: string
    size?: string
    search?: string
    status?: string
    limit?: number
    skip?: number
  } = {},
): Promise<Item[]> {
  const db = await getDatabase()

  const query: any = {}
  if (filters.category) query.category = filters.category
  if (filters.condition) query.condition = filters.condition
  if (filters.size) query.size = filters.size
  if (filters.status) query.status = filters.status
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ]
  }

  const items = await db
    .collection("items")
    .aggregate([
      { $match: query },
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
          size: 1,
          condition: 1,
          images: 1,
          points: 1,
          userId: 1,
          status: 1,
          likes: 1,
          views: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.rating": 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: filters.skip || 0 },
      { $limit: filters.limit || 20 },
    ])
    .toArray()

  return items.map((item) => ({
    ...item,
    _id: item._id.toString(),
    userId: item.userId.toString(),
  }))
}

export async function getFeaturedItems(): Promise<Item[]> {
  return getItems({ status: "approved", limit: 8 })
}

export async function getItemById(id: string): Promise<Item | null> {
  const db = await getDatabase()

  const items = await db
    .collection("items")
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
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
          size: 1,
          condition: 1,
          images: 1,
          points: 1,
          userId: 1,
          status: 1,
          likes: 1,
          views: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.rating": 1,
        },
      },
    ])
    .toArray()

  if (items.length === 0) return null

  const item = items[0]
  return {
    ...item,
    _id: item._id.toString(),
    userId: item.userId.toString(),
  }
}

export async function updateItemViews(id: string): Promise<void> {
  const db = await getDatabase()
  await db.collection("items").updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })
}

export async function likeItem(itemId: string, userId: string): Promise<void> {
  const db = await getDatabase()

  const existingLike = await db.collection("likes").findOne({
    itemId: new ObjectId(itemId),
    userId: new ObjectId(userId),
  })

  if (existingLike) {
    await db.collection("likes").deleteOne({ _id: existingLike._id })
    await db.collection("items").updateOne({ _id: new ObjectId(itemId) }, { $inc: { likes: -1 } })
  } else {
    await db.collection("likes").insertOne({
      itemId: new ObjectId(itemId),
      userId: new ObjectId(userId),
      createdAt: new Date(),
    })
    await db.collection("items").updateOne({ _id: new ObjectId(itemId) }, { $inc: { likes: 1 } })
  }
}
