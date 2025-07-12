"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ end, duration = 2000, suffix = "", className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            let startTime: number
            let animationFrame: number

            const animate = (currentTime: number) => {
              if (!startTime) startTime = currentTime
              const progress = Math.min((currentTime - startTime) / duration, 1)
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4)
              const currentCount = Math.floor(easeOutQuart * end)
              
              setCount(currentCount)

              if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
              }
            }

            animationFrame = requestAnimationFrame(animate)

            return () => {
              if (animationFrame) {
                cancelAnimationFrame(animationFrame)
              }
            }
          }
        })
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Start animation slightly before the element is fully visible
      }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [end, duration, hasAnimated])

  return (
    <span ref={counterRef} className={`animate-count ${className}`}>
      {count.toLocaleString()}{suffix}
    </span>
  )
} 