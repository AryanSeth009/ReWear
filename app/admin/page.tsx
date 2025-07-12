"use client"

import { useState } from "react"
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

  const handleApprove = (itemId: number) => {
    console.log("Approved item:", itemId)
    // Handle approval logic
  }

  const handleReject = (itemId: number, reason: string) => {
    console.log("Rejected item:", itemId, "Reason:", reason)
    setRejectionReason("")
    // Handle rejection logic
  }

  const handleRemoveItem = (itemId: number) => {
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
                    {pendingItems.map((item) => (
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
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell>{item.dateSubmitted}</TableCell>
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
                                    Submitted by {item.user} on {item.dateSubmitted}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
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
                                    <Button onClick={() => handleApprove(item.id)} className="flex-1">
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
                                              onClick={() => handleReject(item.id, rejectionReason)}
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
                            <Button variant="outline" size="sm" onClick={() => handleApprove(item.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <XCircle className="h-4 w-4" />
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
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
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
