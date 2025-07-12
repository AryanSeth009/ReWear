"use client"

import { useEffect, useState, useRef } from "react"
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { useRouter } from "next/navigation"
import Head from "next/head";
import Script from "next/script";

// Add this before the HomePage component to declare VANTA on window
declare global {
  interface Window {
    VANTA: {
      FOG: (config: any) => any;
    };
  }
}

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [featuredItems, setFeaturedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const carouselApi = useRef<UseEmblaCarouselType[1] | null>(null)
  const vantaRef = useRef(null);
  const [vantaReady, setVantaReady] = useState(false);

  // Add ref for stats section
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Parallax state
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.4 }
    );
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let vantaEffect: any;
    if (vantaReady && window.VANTA && vantaRef.current) {
      vantaEffect = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0x10b981,
        midtoneColor: 0x166534,
        lowlightColor: 0x1f2937,
        baseColor: 0x000000,
        blurFactor: 0.48,
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaReady]);

  const handleProtectedLink = (path: string) => {
    if (user) {
      router.push(path)
    } else {
      router.push("/login")
    }
  }

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

  useEffect(() => {
    if (!carouselApi.current) return
    const interval = setInterval(() => {
      if (carouselApi.current) {
        carouselApi.current.scrollNext?.()
      }
    }, 3500)
    return () => clearInterval(interval)
  }, [carouselApi.current])

  return (
    <>
      <Head>
        <title>ReWear</title>
      </Head>
      {/* Load three.js and vanta.fog.min.js in order */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        strategy="afterInteractive"
        onLoad={() => setVantaReady(true)}
      />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
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
            <Link href="/how-it-works" className="nav-anim-link text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">How it works</Link>
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
        {/* Hero Section - Vanta Fog background */}
        <section
          ref={vantaRef}
          className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center relative"
        >
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
                  <Link href={user ? "/browse" : "/login"}>Start Swapping</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white bg-white/20 hover:bg-white/30 dark:border-white/60 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 text-lg px-8 py-4 rounded-xl shadow-lg">
                  <Link href={user ? "/browse" : "/login"}>Browse Items</Link>
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
        <section ref={statsRef} className="py-16 bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center bg-gray-800 rounded-xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Users className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-3xl font-bold text-white">
                  {statsVisible ? <AnimatedCounter end={2500} suffix="+" /> : '0+'}
                </h3>
                <p className="text-gray-300">Active Members</p>
              </div>
              <div className="flex flex-col items-center bg-gray-800 rounded-xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Shirt className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-3xl font-bold text-white">
                  {statsVisible ? <AnimatedCounter end={15000} suffix="+" /> : '0+'}
                </h3>
                <p className="text-gray-300">Items Exchanged</p>
              </div>
              <div className="flex flex-col items-center bg-gray-800 rounded-xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Recycle className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-3xl font-bold text-white">
                  {statsVisible ? <AnimatedCounter end={8200} suffix="kg" /> : '0kg'}
                </h3>
                <p className="text-gray-300">Textile Waste Saved</p>
              </div>
              <div className="flex flex-col items-center bg-gray-800 rounded-xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Award className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-3xl font-bold text-white">
                  {statsVisible ? <AnimatedCounter end={98} suffix="%" /> : '0%'}
                </h3>
                <p className="text-gray-300">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-green-900 transition-colors duration-300">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">Featured Items</h3>
            <div className="relative bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                  slidesToScroll: 1,
                  dragFree: true,
                  breakpoints: {
                    '(min-width: 1024px)': { slidesToScroll: 4 },
                    '(max-width: 1023px)': { slidesToScroll: 2 },
                  },
                }}
                className="w-full"
                setApi={api => (carouselApi.current = api ?? null)}
              >
                <CarouselContent className="">
                  {(loading ? Array.from({ length: 4 }) : featuredItems).map((item, i) => (
                    <CarouselItem
                      key={item?._id || i}
                      className="basis-full sm:basis-1/2 lg:basis-1/4 px-2 animate-fade-in-up"
                      style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                    >
                      <Card className={`overflow-hidden ${loading ? 'animate-pulse bg-gray-700' : 'hover:shadow-xl transition-shadow bg-gray-900 border-gray-700'} rounded-xl`}>
                        <div className="aspect-square relative">
                          {loading ? (
                            <div className="w-full h-full bg-gray-600" />
                          ) : (
                            <Image
                              src={item.images?.[0] || "/placeholder.svg?height=200&width=200"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <CardContent className="p-4">
                          {loading ? (
                            <>
                              <div className="h-4 bg-gray-600 rounded mb-2" />
                              <div className="h-3 bg-gray-600 rounded mb-2" />
                              <div className="h-3 bg-gray-600 rounded" />
                            </>
                          ) : (
                            <>
                              <h4 className="font-semibold mb-2 text-white">{item.title}</h4>
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary">{item.category}</Badge>
                                <span className="text-sm text-gray-300">{item.condition}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">
                                  by {item.user?.firstName} {item.user?.lastName?.[0]}.
                                </span>
                                <span className="font-semibold text-green-400">{item.points} pts</span>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6" />
                <CarouselNext className="-right-6" />
              </Carousel>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild className="border-green-400 text-green-400 hover:bg-green-900 hover:text-white transition-all duration-300">
                <Link href={user ? "/browse" : "/login"}>View All Items</Link>
              </Button>
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
                    <Link href={user ? "/browse" : "/login"} className="hover:text-white transition-colors">Browse Items</Link>
                  </li>
                  <li>
                    <Link href={user ? "/add-item" : "/login"} className="hover:text-white transition-colors">List an Item</Link>
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
    </>
  )
}
