"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        window.location.href = "/dashboard"
      } else {
        const data = await response.json()
        setError(data.message || "Sign in failed")
      }
    } catch (error) {
      setError("An error occurred during sign in")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grainy animated overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-soft-light" style={{background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: 'cover', animation: 'grainMove 2s steps(2) infinite'}} />
      {/* Moving blurred blob */}
      <div className="absolute left-1/2 top-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-green-400/30 dark:bg-green-600/20 rounded-full filter blur-3xl opacity-60 animate-blob-float" />
      {/* Dynamic wavy background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary wave */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-400/30 dark:from-green-500/20 dark:to-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wave-1"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wave-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 dark:from-teal-500/20 dark:to-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-wave-3"></div>
        
        {/* Secondary floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-300/40 dark:bg-green-600/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-emerald-300/40 dark:bg-emerald-600/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-2"></div>
        <div className="absolute top-3/4 right-1/3 w-20 h-20 bg-teal-300/40 dark:bg-teal-600/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-3"></div>
        
        {/* Wavy lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/20 dark:via-green-500/20 to-transparent animate-wave-line-1"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/20 dark:via-emerald-500/20 to-transparent animate-wave-line-2"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/20 dark:via-teal-500/20 to-transparent animate-wave-line-3"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes wave-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          25% { transform: translate(50px, -30px) scale(1.1) rotate(90deg); }
          50% { transform: translate(-20px, 40px) scale(0.9) rotate(180deg); }
          75% { transform: translate(30px, -20px) scale(1.05) rotate(270deg); }
        }
        @keyframes wave-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(-40px, 30px) scale(1.15) rotate(120deg); }
          66% { transform: translate(30px, -40px) scale(0.85) rotate(240deg); }
        }
        @keyframes wave-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          50% { transform: translate(20px, -30px) scale(1.2) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-180deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        @keyframes wave-line-1 {
          0%, 100% { transform: translateX(-100%) scaleX(0); opacity: 0; }
          50% { transform: translateX(0%) scaleX(1); opacity: 1; }
        }
        @keyframes wave-line-2 {
          0%, 100% { transform: translateX(100%) scaleX(0); opacity: 0; }
          50% { transform: translateX(0%) scaleX(1); opacity: 1; }
        }
        @keyframes wave-line-3 {
          0%, 100% { transform: translateX(-100%) scaleX(0); opacity: 0; }
          50% { transform: translateX(0%) scaleX(1); opacity: 1; }
        }
        @keyframes grainMove {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
        @keyframes blob-float {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { transform: translate(-60%, -40%) scale(1.1) rotate(30deg); }
        }
        .animate-wave-1 {
          animation: wave-1 8s ease-in-out infinite;
        }
        .animate-wave-2 {
          animation: wave-2 10s ease-in-out infinite;
        }
        .animate-wave-3 {
          animation: wave-3 12s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }
        .animate-wave-line-1 {
          animation: wave-line-1 4s ease-in-out infinite;
        }
        .animate-wave-line-2 {
          animation: wave-line-2 4s ease-in-out infinite 1s;
        }
        .animate-wave-line-3 {
          animation: wave-line-3 4s ease-in-out infinite 2s;
        }
      `}</style>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 px-4 py-2 rounded-lg border border-green-200/30 dark:border-green-800/30"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-green-800 dark:text-green-400">
            <Recycle className="h-8 w-8 text-green-600 dark:text-green-400" />
            ReWear
          </Link>
          <p className="text-gray-700 dark:text-gray-200 mt-2">Welcome back to the community</p>
        </div>

        <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border border-green-200/50 dark:border-green-800/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-green-200/50 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-green-200/50 dark:border-green-800/50 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {"Don't have an account? "}
                <Link href="/signup" className="text-green-600 dark:text-green-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
