"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ThemeToggle } from "@/components/theme-provider"
import {
  Recycle,
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  ArrowUpDown,
  Coins,
} from "lucide-react"

// Mock item data
const item = {
  id: 1,
  title: "Vintage Denim Jacket",
  description:
    "Beautiful vintage denim jacket from the 90s. Perfect for layering and has that authentic worn-in look. Features classic button closure, chest pockets, and adjustable waist tabs. No major flaws, just normal vintage wear that adds to its character.",
  category: "Outerwear",
  type: "Jacket",
  size: "M",
  condition: "Good",
  points: 25,
  tags: ["vintage", "denim", "90s", "casual", "layering"],
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  user: {
    name: "Sarah M.",
    avatar: "/placeholder-user.jpg",
    rating: 4.8,
    totalSwaps: 23,
    joinDate: "March 2023",
    location: "New York, NY",
  },
  datePosted: "2024-01-10",
  views: 45,
  likes: 12,
  available: true,
}

export default function ItemDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const [swapMessage, setSwapMessage] = useState("")

  const handleSwapRequest = () => {
    // Handle swap request logic
    console.log("Swap request sent:", swapMessage)
    setShowSwapDialog(false)
    setSwapMessage("")
  }

  const handleRedeem = () => {
    // Handle point redemption logic
    console.log("Item redeemed for points")
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
            <Link href="/dashboard" className="text-gray-600 hover:text-green-600">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src={item.images[selectedImage] || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
              />
              {!item.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    No Longer Available
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 relative rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${item.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{item.category}</Badge>
                    <Badge variant="outline">{item.type}</Badge>
                    <Badge variant="secondary">{item.condition}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {item.datePosted}
                </span>
                <span>{item.views} views</span>
                <span>{item.likes} likes</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-green-600">{item.points}</span>
                    <span className="text-lg text-gray-600 ml-1">points</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="text-lg font-semibold">{item.size}</p>
                  </div>
                </div>

                {item.available ? (
                  <div className="space-y-3">
                    <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          Request Swap
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Swap</DialogTitle>
                          <DialogDescription>
                            Send a message to {item.user.name} to request a swap for this item.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              placeholder="Hi! I'm interested in swapping for your item. I have..."
                              value={swapMessage}
                              onChange={(e) => setSwapMessage(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSwapRequest} className="flex-1">
                              Send Request
                            </Button>
                            <Button variant="outline" onClick={() => setShowSwapDialog(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={handleRedeem}>
                      <Coins className="h-4 w-4 mr-2" />
                      Redeem with Points
                    </Button>

                    <Button variant="ghost" className="w-full" size="lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Seller
                    </Button>
                  </div>
                ) : (
                  <Button disabled className="w-full" size="lg">
                    No Longer Available
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Item Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seller Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={item.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{item.user.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{item.user.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {item.user.location}
                  </div>
                  <div>
                    <span className="font-medium">{item.user.totalSwaps}</span> successful swaps
                  </div>
                  <div>Member since {item.user.joinDate}</div>
                </div>
              </div>
              <Button variant="outline">View Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
