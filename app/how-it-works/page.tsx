"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Upload, Search, ArrowLeftRight, Coins, Shield, Users, Award } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-provider"
import { useRouter } from "next/navigation"
import { AnimatedCounter } from "@/components/animated-counter"

export default function HowItWorksPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleProtectedLink = (path: string) => {
    if (user) {
      router.push(path)
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Floating, sticky, glassmorphic navbar */}
      <header className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[95vw] max-w-6xl rounded-2xl bg-white/70 dark:bg-gray-900/70 shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">ReWear</h1>
        </div>
        <style jsx>{`
          .nav-anim-link {
            position: relative;
            display: inline-block;
            padding-bottom: 4px;
            transition: color 0.2s;
          }
          .nav-anim-link:after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%) scaleX(0);
            width: 70%;
            height: 3px;
            background: #10b981;
            border-radius: 2px;
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
            z-index: 1;
          }
          .nav-anim-link:hover:after, .nav-anim-link:focus-visible:after {
            transform: translateX(-50%) scaleX(1);
          }
        `}</style>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/how-it-works" className="nav-anim-link text-green-600 dark:text-green-400 font-medium transition-colors after:!scale-x-100 after:transform after:translate-x-[-50%]">How it works</Link>
          <button 
            onClick={() => handleProtectedLink("/browse")} 
            className="nav-anim-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
          >
            Browse
          </button>
          <button 
            onClick={() => handleProtectedLink("/add-item")} 
            className="nav-anim-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
          >
            List an Item
          </button>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild className="text-gray-700 dark:text-gray-200">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 mt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white drop-shadow-lg">How ReWear Works</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of people giving their clothes a second life while earning points and helping the environment.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <Card className="text-center bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md flex flex-col items-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            {/* Large Doodle/Cartoon Image (inside card, like item card) */}
            <div className="w-full flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <img src="/list-your-items.png" alt="List Your Items Doodle" className="w-full max-w-[180px] aspect-square object-contain rounded-xl bg-gray-100 dark:bg-gray-900" />
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/60 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-800 group-hover:scale-110">
              <Upload className="h-7 w-7 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">1. List Your Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300">
                Upload photos and details of clothes you no longer wear. Our community will review and approve your listings.
              </p>
            </CardContent>
          </Card>
          {/* Step 2 */}
          <Card className="text-center bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md flex flex-col items-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            {/* Large Doodle/Cartoon Image (inside card, like item card) */}
            <div className="w-full flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <img src="/browse-&-request.png" alt="browse & request" className="w-full max-w-[180px] aspect-square object-contain rounded-xl bg-gray-100 dark:bg-gray-900" />
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/60 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-800 group-hover:scale-110">
              <Search className="h-7 w-7 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">2. Browse & Request</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300">
                Discover amazing pre-loved items from other members. Request direct swaps or use your earned points.
              </p>
            </CardContent>
          </Card>
          {/* Step 3 */}
          <Card className="text-center bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md flex flex-col items-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            {/* Large Doodle/Cartoon Image (inside card, like item card) */}
            <div className="w-full flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <img src="/swap-&-enjoy.png" alt="swap & enjoy" className="w-full max-w-[180px] aspect-square object-contain rounded-xl bg-gray-100 dark:bg-gray-900" />
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/60 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-800 group-hover:scale-110">
              <ArrowLeftRight className="h-7 w-7 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">3. Swap & Enjoy</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 dark:text-gray-300">
                Complete the exchange and enjoy your new-to-you clothing while helping reduce textile waste.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            <CardHeader className="text-center">
              <Coins className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">Points System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Earn points for each approved listing. Use points to redeem items you love.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                All items are reviewed by our community to ensure quality and accurate descriptions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Join a community of sustainable fashion enthusiasts who care about the environment.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 group">
            <CardHeader className="text-center">
              <Award className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-300">Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Every swap helps reduce textile waste and promotes sustainable fashion practices.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800/80 rounded-lg p-8 mb-16 shadow-lg backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                <AnimatedCounter end={2500} suffix="+" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">Active Members</div>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                <AnimatedCounter end={15000} suffix="+" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">Items Exchanged</div>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                <AnimatedCounter end={8200} suffix="kg" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">Textile Waste Saved</div>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Start?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join the sustainable fashion revolution today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105">
              <Link href={user ? "/browse" : "/signup"}>
                {user ? "Browse Items" : "Get Started"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="transition-all duration-300 hover:scale-105">
              <Link href={user ? "/add-item" : "/login"}>
                {user ? "Add Your First Item" : "Sign In"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 