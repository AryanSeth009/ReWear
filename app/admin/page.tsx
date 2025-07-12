"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Recycle, Shield, CheckCircle, XCircle, Eye, Users, Package, AlertTriangle, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-provider"

const pendingItems = [
  {
    id: 1,
    title: "Vintage Band T-Shirt",
    user: "John D.",
    category: "Tops",
    condition: "Good",
    dateSubmitted: "2024-01-15",
    image: "/placeholder.svg?height=100&width=100",
    status: "pending",
  },
  {
    id: 2,
    title: "Designer Handbag",
    user: "Sarah M.",
    category: "Accessories",
    condition: "Excellent",
    dateSubmitted: "2024-01-14",
    image: "/placeholder.svg?height=100&width=100",
    status: "pending",
  },
  {
    id: 3,
    title: "Running Shoes",
    user: "Mike R.",
    category: "Footwear",
    condition: "Like New",
    dateSubmitted: "2024-01-13",
    image: "/placeholder.svg?height=100&width=100",
    status: "pending",
  },
]

const reportedItems = [
  {
    id: 4,
    title: "Suspicious Designer Bag",
    user: "Unknown User",
    reporter: "Lisa T.",
    reason: "Suspected counterfeit",
    dateReported: "2024-01-12",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const stats = {
  totalUsers: 2547,
  activeListings: 1823,
  pendingReviews: 23,
  completedSwaps: 15420,
  monthlyGrowth: 12.5,
}

export default function AdminPage() {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [pendingItems, setPendingItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load pending items
  useEffect(() => {
    const loadPendingItems = async () => {
      try {
        const response = await fetch('/api/admin/items/pending')
        if (response.ok) {
          const items = await response.json()
          setPendingItems(items)
        }
      } catch (error) {
        console.error('Error loading pending items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPendingItems()
  }, [])

  const handleApprove = async (itemId: string) => {
    try {
      const response = await fetch('/api/admin/items/pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          action: 'approve'
        }),
      })

      if (response.ok) {
        // Remove item from pending list
        setPendingItems(prev => prev.filter(item => item._id !== itemId))
      }
    } catch (error) {
      console.error('Error approving item:', error)
    }
  }

  const handleReject = async (itemId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/items/pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          action: 'reject'
        }),
      })

      if (response.ok) {
        // Remove item from pending list
        setPendingItems(prev => prev.filter(item => item._id !== itemId))
        setRejectionReason("")
      }
    } catch (error) {
      console.error('Error rejecting item:', error)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    console.log("Removed item:", itemId)
    // Handle item removal logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">ReWear Admin</h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin Panel
            </Badge>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Exit Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{stats.activeListings.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Swaps</p>
                  <p className="text-2xl font-bold">{stats.completedSwaps.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pending Reviews ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="reported" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Reported Items ({reportedItems.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Items Pending Review</CardTitle>
                <CardDescription>Review and approve or reject new item listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span className="ml-2">Loading pending items...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : pendingItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-gray-500">No pending items to review</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image
                                src={item.images?.[0] || "/placeholder.svg"}
                                alt={item.title}
                                width={50}
                                height={50}
                                className="rounded-md object-cover"
                              />
                              <span className="font-medium">{item.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{`${item.user?.firstName} ${item.user?.lastName}`}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>{item.condition}</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Review Item: {item.title}</DialogTitle>
                                    <DialogDescription>
                                      Submitted by {`${item.user?.firstName} ${item.user?.lastName}`} on {new Date(item.createdAt).toLocaleDateString()}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="aspect-video relative rounded-lg overflow-hidden">
                                      <Image
                                        src={item.images?.[0] || "/placeholder.svg"}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Category</Label>
                                        <p>{item.category}</p>
                                      </div>
                                      <div>
                                        <Label>Condition</Label>
                                        <p>{item.condition}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button onClick={() => handleApprove(item._id)} className="flex-1">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="destructive" className="flex-1">
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Reject Item</DialogTitle>
                                            <DialogDescription>
                                              Please provide a reason for rejecting this item
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div>
                                              <Label htmlFor="reason">Rejection Reason</Label>
                                              <Textarea
                                                id="reason"
                                                placeholder="Please explain why this item is being rejected..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                rows={3}
                                              />
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                variant="destructive"
                                                onClick={() => handleReject(item._id, rejectionReason)}
                                                className="flex-1"
                                              >
                                                Confirm Rejection
                                              </Button>
                                              <Button variant="outline" className="flex-1 bg-transparent">
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="outline" size="sm" onClick={() => handleApprove(item._id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reported" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reported Items</CardTitle>
                <CardDescription>Review items reported by community members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell>{item.reporter}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{item.reason}</Badge>
                        </TableCell>
                        <TableCell>{item.dateReported}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id.toString())}>
                              Remove
                            </Button>
                            <Button variant="outline" size="sm">
                              Dismiss
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
