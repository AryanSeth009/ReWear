"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Users, Shirt, Award } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Chatbot } from "@/components/chatbot"

export default function HomePage() {
  const { user } = useAuth()
  const [featuredItems, setFeaturedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedItems() {
      try {
        const response = await fetch("/api/items/featured")
        if (response.ok) {
          const items = await response.json()
          setFeaturedItems(items)
        }
      } catch (error) {
        console.error("Error loading featured items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedItems()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">ReWear</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-gray-600 hover:text-green-600">
              Browse
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-green-600">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/add-item">Add Item</Link>
                </Button>
              </>
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Give Your Clothes a <span className="text-green-600">Second Life</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of conscious fashion lovers. Swap, share, and discover pre-loved clothing while reducing
            textile waste and building a sustainable wardrobe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <Link href={user ? "/browse" : "/signup"}>Start Swapping</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/browse">Browse Items</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={user ? "/add-item" : "/signup"}>List an Item</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">2,500+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="flex flex-col items-center">
              <Shirt className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">15,000+</h3>
              <p className="text-gray-600">Items Exchanged</p>
            </div>
            <div className="flex flex-col items-center">
              <Recycle className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">8,200kg</h3>
              <p className="text-gray-600">Textile Waste Saved</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">98%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Items</h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-sm text-gray-600">{item.condition}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        by {item.user?.firstName} {item.user?.lastName?.[0]}.
                      </span>
                      <span className="font-semibold text-green-600">{item.points} pts</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/browse">View All Items</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How ReWear Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">List Your Items</h4>
              <p className="text-gray-600">
                Upload photos and details of clothes you no longer wear. Earn points for each approved listing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Browse & Request</h4>
              <p className="text-gray-600">
                Discover amazing pre-loved items. Request swaps or use your points to redeem items you love.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Swap & Enjoy</h4>
              <p className="text-gray-600">
                Complete the exchange and enjoy your new-to-you clothing while helping the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Recycle className="h-6 w-6" />
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-gray-400">Building a sustainable fashion community, one swap at a time.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse">Browse Items</Link>
                </li>
                <li>
                  <Link href="/add-item">List an Item</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How It Works</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/sustainability">Sustainability</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
