"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Recycle, Search, Filter, Heart, Eye, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-provider"
import { useRouter } from "next/navigation"

export default function BrowsePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // All hooks must be called at the top level
  const [items, setItems] = useState<any[]>([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // All useEffect hooks must be at the top level
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadItems = async () => {
    try {
      setItemsLoading(true)
      const params = new URLSearchParams()
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm)
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (selectedCondition !== "all") params.append("condition", selectedCondition)
      if (selectedSize !== "all") params.append("size", selectedSize)
      if (sortBy !== "newest") params.append("sort", sortBy)

      const response = await fetch(`/api/items?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setItemsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [debouncedSearchTerm, selectedCategory, selectedCondition, selectedSize, sortBy, user])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null
  }

  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories"]
  const conditions = ["Like New", "Excellent", "Good", "Fair"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedCondition("all")
    setSelectedSize("all")
    setSortBy("newest")
  }

  const activeFiltersCount = [
    debouncedSearchTerm,
    selectedCategory !== "all",
    selectedCondition !== "all",
    selectedSize !== "all",
    sortBy !== "newest"
  ].filter(Boolean).length

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Condition</Label>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={selectedCondition === condition}
                onCheckedChange={(checked) => {
                  setSelectedCondition(checked ? condition : "all")
                }}
                className="border-gray-300 dark:border-gray-600"
              />
              <Label htmlFor={condition} className="text-sm text-gray-700 dark:text-gray-300">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Size</Label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="all">All Sizes</SelectItem>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full text-gray-600 dark:text-gray-300"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )

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
            <Link href="/browse" className="text-green-600 dark:text-green-400 font-medium">
              Browse
            </Link>
            <Link href="/add-item" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Add Item
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 sticky top-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h3>
              <FilterPanel />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Items</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {itemsLoading ? "Loading..." : `${items.length} items found`}
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="points-low">Points: Low to High</SelectItem>
                  <SelectItem value="points-high">Points: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {itemsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Link key={item._id} href={`/items/${item._id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 group cursor-pointer">
                      <div className="aspect-square relative">
                        <Image
                          src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                            onClick={(e) => {
                              e.preventDefault()
                              // TODO: Implement like functionality
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          <Eye className="h-3 w-3" />
                          <span>{item.views || 0}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{item.condition}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            by {item.user?.firstName} {item.user?.lastName?.[0]}.
                          </span>
                          <span className="font-semibold text-green-600 dark:text-green-400">{item.points} pts</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!itemsLoading && items.length === 0 && (
              <div className="text-center py-12">
                <Recycle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your filters or search terms.</p>
                <Button asChild>
                  <Link href="/add-item">Add Your First Item</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
