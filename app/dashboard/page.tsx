"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Recycle, Plus, Star, Package, ArrowUpDown, Settings, LogOut, User, Heart, Clock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-provider"

// Types
interface Item {
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

interface Swap {
  _id: string
  itemId: string
  requesterId: string
  ownerId: string
  status: "pending" | "accepted" | "rejected" | "completed"
  message?: string
  createdAt: Date
  updatedAt: Date
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [userItems, setUserItems] = useState<Item[]>([])
  const [activeSwaps, setActiveSwaps] = useState<Swap[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingSwaps, setLoadingSwaps] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserItems()
      loadUserSwaps()
    }
  }, [user])

  const loadUserItems = async () => {
    try {
      const response = await fetch(`/api/items?userId=${user!._id}`)
      if (response.ok) {
        const items = await response.json()
        setUserItems(items)
      }
    } catch (error) {
      console.error("Error loading user items:", error)
    } finally {
      setLoadingItems(false)
    }
  }

  const loadUserSwaps = async () => {
    try {
      const response = await fetch(`/api/swaps?userId=${user!._id}`)
      if (response.ok) {
        const swaps = await response.json()
        setActiveSwaps(swaps.filter((swap: Swap) => swap.status !== "completed"))
      }
    } catch (error) {
      console.error("Error loading user swaps:", error)
    } finally {
      setLoadingSwaps(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" })
      if (response.ok) {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Please sign in</h1>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">ReWear</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Browse
            </Link>
            <Link href="/add-item" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Add Item
            </Link>
            <Link href="/dashboard" className="text-green-600 dark:text-green-400 font-medium">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Points Balance</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{user.points} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Swaps</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{activeSwaps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{user.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Member Since</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/add-item">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="items" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="items" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  <Package className="h-4 w-4" />
                  My Items
                </TabsTrigger>
                <TabsTrigger value="swaps" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  <ArrowUpDown className="h-4 w-4" />
                  Active Swaps
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Items</h2>
                  <Button asChild>
                    <Link href="/add-item">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Link>
                  </Button>
                </div>
                {loadingItems ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="overflow-hidden animate-pulse bg-white dark:bg-gray-800">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : userItems.length === 0 ? (
                  <Card className="text-center py-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No items yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Start by adding your first item to the platform.</p>
                    <Button asChild>
                      <Link href="/add-item">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Item
                      </Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <div className="aspect-square relative">
                          <Image
                            src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge 
                              variant={item.status === "approved" ? "default" : "secondary"}
                              className={item.status === "approved" ? "bg-green-600 dark:bg-green-500" : ""}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h4>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{item.category}</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item.condition}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-600 dark:text-green-400">{item.points} pts</span>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Heart className="h-4 w-4" />
                              {item.likes}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="swaps" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Swaps</h2>
                </div>
                {loadingSwaps ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse bg-white dark:bg-gray-800">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : activeSwaps.length === 0 ? (
                  <Card className="text-center py-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No active swaps</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Start browsing items to make your first swap!</p>
                    <Button asChild>
                      <Link href="/browse">Browse Items</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeSwaps.map((swap) => (
                      <Card key={swap._id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Swap Request</h4>
                            <Badge 
                              variant={swap.status === "accepted" ? "default" : "secondary"}
                              className={swap.status === "accepted" ? "bg-green-600 dark:bg-green-500" : ""}
                            >
                              {swap.status}
                            </Badge>
                          </div>
                          {swap.message && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{swap.message}</p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Requested {new Date(swap.createdAt).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
                </div>
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300">Profile settings and preferences will be available here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
