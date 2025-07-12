"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Recycle, Search, Filter, Heart, Eye } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function BrowsePage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories"]
  const conditions = ["Like New", "Excellent", "Good", "Fair"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  useEffect(() => {
    loadItems()
  }, [searchTerm, selectedCategory, selectedCondition, selectedSize])

  const loadItems = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (selectedCondition !== "all") params.append("condition", selectedCondition)
      if (selectedSize !== "all") params.append("size", selectedSize)

      const response = await fetch(`/api/items?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setLoading(false)
    }
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
            <Link href="/browse" className="text-green-600 font-medium">
              Browse
            </Link>
            <Link href="/add-item" className="text-gray-600 hover:text-green-600">
              Add Item
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-600 hover:text-green-600">
                Dashboard
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild>
                <Link href="/add-item">Add Item</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>

              {/* Search */}
              <div className="space-y-2 mb-6">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 mb-6">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div className="space-y-2 mb-6">
                <Label>Condition</Label>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={selectedCondition === condition}
                        onCheckedChange={(checked) => {
                          setSelectedCondition(checked ? condition : "all")
                        }}
                      />
                      <Label htmlFor={condition} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Browse Items ({items.length})</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="points-low">Points: Low to High</SelectItem>
                  <SelectItem value="points-high">Points: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-square relative">
                      <Image
                        src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.condition}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-xs">
                        <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                          <Heart className="h-3 w-3" />
                          {item.likes}
                        </div>
                        <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-sm text-gray-600">Size {item.size}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-green-600">{item.points} pts</span>
                        <span className="text-sm text-gray-600">{item.user?.location || "Unknown"}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        by {item.user?.firstName} {item.user?.lastName}
                      </div>
                      <Button asChild className="w-full" size="sm">
                        <Link href={`/items/${item._id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No items found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedCondition("all")
                    setSelectedSize("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
