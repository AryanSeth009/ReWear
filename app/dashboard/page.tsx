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
import { getItems } from "@/lib/items"
import { getUserSwaps } from "@/lib/swaps"
import { signOutAction } from "@/app/actions/auth"
import type { Item } from "@/lib/items"
import type { Swap } from "@/lib/swaps"

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
      const items = await getItems({ userId: user!.id })
      setUserItems(items)
    } catch (error) {
      console.error("Error loading user items:", error)
    } finally {
      setLoadingItems(false)
    }
  }

  const loadUserSwaps = async () => {
    try {
      const swaps = await getUserSwaps(user!.id)
      setActiveSwaps(swaps.filter((swap) => swap.status !== "completed"))
    } catch (error) {
      console.error("Error loading user swaps:", error)
    } finally {
      setLoadingSwaps(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">ReWear</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 hover:text-green-600">
              Browse
            </Link>
            <Link href="/add-item" className="text-gray-600 hover:text-green-600">
              Add Item
            </Link>
            <Link href="/dashboard" className="text-green-600 font-medium">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <form action={signOutAction}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} />
                  <AvatarFallback>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>
                  {user.first_name} {user.last_name}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points Balance</span>
                  <span className="font-semibold text-green-600">{user.points} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Swaps</span>
                  <span className="font-semibold">{user.total_swaps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{user.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  My Items
                </TabsTrigger>
                <TabsTrigger value="swaps" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Active Swaps
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Items</h2>
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
                      <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200" />
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2" />
                          <div className="h-3 bg-gray-200 rounded mb-2" />
                          <div className="h-3 bg-gray-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <Image
                            src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <Badge
                            className="absolute top-2 right-2"
                            variant={item.status === "approved" && item.available ? "default" : "secondary"}
                          >
                            {item.status === "approved" && item.available
                              ? "Available"
                              : item.status === "pending"
                                ? "Pending"
                                : item.status === "rejected"
                                  ? "Rejected"
                                  : "Unavailable"}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{item.category}</Badge>
                            <span className="text-sm text-gray-600">{item.condition}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-green-600">{item.points} pts</span>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {item.likes}
                              </span>
                              <span>{item.views} views</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                            <Link href={`/items/${item.id}`}>View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {userItems.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">You haven't listed any items yet</p>
                        <Button asChild>
                          <Link href="/add-item">List Your First Item</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="swaps" className="space-y-6">
                <h2 className="text-2xl font-bold">Active Swaps</h2>
                {loadingSwaps ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-4" />
                          <div className="h-3 bg-gray-200 rounded mb-2" />
                          <div className="h-3 bg-gray-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeSwaps.map((swap) => (
                      <Card key={swap.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Badge variant={swap.requester_id === user.id ? "default" : "secondary"}>
                                {swap.requester_id === user.id ? "Outgoing" : "Incoming"}
                              </Badge>
                              <span className="font-semibold">{swap.owner_item.title}</span>
                            </div>
                            <Badge variant={swap.status === "approved" ? "default" : "outline"}>
                              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                {swap.requester_id === user.id ? "Trading with" : "Request from"}
                              </p>
                              <p className="font-medium">
                                {swap.requester_id === user.id
                                  ? `${swap.owner.first_name} ${swap.owner.last_name}`
                                  : `${swap.requester.first_name} ${swap.requester.last_name}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Type</p>
                              <p className="font-medium capitalize">{swap.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              {new Date(swap.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/swaps/${swap.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {activeSwaps.length === 0 && (
                      <div className="text-center py-8">
                        <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No active swaps</p>
                        <Button variant="outline" asChild>
                          <Link href="/browse">Browse Items to Swap</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <input className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={user.first_name} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <input className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={user.last_name} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue={user.email} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <input
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        defaultValue={user.location || ""}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        rows={3}
                        defaultValue={user.bio || ""}
                        placeholder="Tell others about yourself and your style preferences..."
                      />
                    </div>
                    <Button>Save Changes</Button>
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
