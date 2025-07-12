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
import { ThemeToggle } from "@/components/theme-provider"
import { AnimatedCounter } from "@/components/animated-counter"

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Floating, sticky, glassmorphic navbar */}
      <header className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[95vw] max-w-6xl rounded-2xl bg-white/70 dark:bg-gray-900/70 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">ReWear</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">How it works</Link>
          <Link href="/browse" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Browse</Link>
          <Link href="/add-item" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">List an Item</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="text-gray-700 dark:text-gray-200">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section - no cards, heading and image adjacent, animated heading */}
      <section className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center bg-[linear-gradient(120deg,#10b981_0%,#059669_50%,#047857_100%)] dark:bg-[linear-gradient(120deg,#134e4a_0%,#166534_50%,#22c55e_100%)] bg-[length:200%_200%] animate-gradient-move p-0 transition-colors duration-300">
        <style jsx global>{`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move {
            animation: gradient-move 16s ease-in-out infinite;
          }
          @keyframes hero-heading {
            0% { opacity: 0; transform: translateY(40px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .hero-heading-animate {
            animation: hero-heading 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        `}</style>
        <div className="flex flex-col md:flex-row items-center justify-center w-full h-full gap-12 px-4 md:px-16 mt-32 md:mt-0">
          {/* Left: Animated Heading and Text */}
          <div className="flex-1 flex flex-col items-start justify-center min-h-[400px] max-w-2xl">
            <h2 className="hero-heading-animate text-5xl md:text-7xl font-extrabold mb-6 text-white dark:text-white leading-tight drop-shadow-lg">
              Give Your Clothes a Second Life
            </h2>
            <p className="text-lg md:text-2xl text-white/90 dark:text-white/80 mb-10 max-w-xl">
              Exchange unused clothing directly or earn points to redeem new-to-you items. Join ReWear and help reduce textile waste.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg">
                <Link href={user ? "/browse" : "/signup"}>Start Swapping</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white bg-white/20 hover:bg-white/30 dark:border-white/60 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 text-lg px-8 py-4 rounded-xl shadow-lg">
                <Link href="/browse">Browse Items</Link>
              </Button>
            </div>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center min-h-[400px] max-w-2xl">
            <img
              src="/hero-exchange.jpg"
              alt="Assorted clothing on hangers"
              className="object-cover w-full h-[350px] md:h-[420px] rounded-2xl shadow-2xl border border-white/30 dark:border-white/10"
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={2500} suffix="+" />
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Active Members</p>
            </div>
            <div className="flex flex-col items-center">
              <Shirt className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={15000} suffix="+" />
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Items Exchanged</p>
            </div>
            <div className="flex flex-col items-center">
              <Recycle className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={8200} suffix="kg" />
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Textile Waste Saved</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter end={98} suffix="%" />
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Featured Items</h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse bg-white dark:bg-gray-900">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <div className="aspect-square relative">
                    <Image
                      src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h4>
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
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">How ReWear Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">List Your Items</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Upload photos and details of clothes you no longer wear. Earn points for each approved listing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Browse & Request</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Discover amazing pre-loved items. Request swaps or use your points to redeem items you love.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Swap & Enjoy</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Complete the exchange and enjoy your new-to-you clothing while helping the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
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
                  <Link href="/browse" className="hover:text-white transition-colors">Browse Items</Link>
                </li>
                <li>
                  <Link href="/add-item" className="hover:text-white transition-colors">List an Item</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                </li>
                <li>
                  <Link href="/sustainability" className="hover:text-white transition-colors">Sustainability</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
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
