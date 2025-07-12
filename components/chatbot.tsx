"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  suggestions?: string[]
}

const QUICK_ACTIONS = [
  "How do I list an item?",
  "How does the point system work?",
  "How to request a swap?",
  "What items are not allowed?",
  "How to increase my rating?",
  "Sustainability tips",
]

const BOT_RESPONSES = {
  greeting:
    "Hi! I'm ReBot, your ReWear assistant! 🌱 I'm here to help you with clothing swaps, sustainability tips, and platform guidance. How can I help you today?",

  "how do i list an item":
    "To list an item on ReWear:\n\n1. Click 'Add Item' in the header\n2. Upload clear photos of your clothing\n3. Fill in details (title, description, category, size, condition)\n4. Set a fair point value\n5. Submit for review\n\nOnce approved, you'll earn 10 bonus points! 🎉",

  "how does the point system work":
    "ReWear uses a point system for fair exchanges:\n\n• New users get 100 welcome points\n• Earn 10 points for each approved listing\n• Use points to 'buy' items from others\n• Points reflect item value and condition\n• Higher quality items = more points\n\nThis ensures fair trades for everyone! 💚",

  "how to request a swap":
    "To request a swap:\n\n1. Browse items and find something you like\n2. Click on the item to view details\n3. Choose your swap option:\n   - Offer one of your items\n   - Use your points\n4. Add a friendly message\n5. Submit your request\n\nThe owner will review and respond! 🤝",

  "what items are not allowed":
    "For everyone's safety, these items aren't allowed:\n\n❌ Underwear and intimate apparel\n❌ Damaged or stained items\n❌ Counterfeit designer goods\n❌ Items with strong odors\n❌ Swimwear\n❌ Items with missing care labels\n\nWe want quality items that bring joy to new owners! ✨",

  "how to increase my rating":
    "Build your ReWear reputation:\n\n⭐ Complete swaps promptly\n⭐ Describe items accurately\n⭐ Package items carefully\n⭐ Communicate clearly with other users\n⭐ Leave honest reviews\n⭐ Be responsive to messages\n\nGreat ratings lead to more successful swaps! 🌟",

  "sustainability tips":
    "Make your wardrobe more sustainable:\n\n🌱 Buy less, choose well\n🌱 Care for clothes properly (wash cold, air dry)\n🌱 Repair instead of replacing\n🌱 Swap with friends and family\n🌱 Donate or recycle unwanted items\n🌱 Choose quality over quantity\n🌱 Support ethical brands\n\nEvery small action makes a difference! 🌍",

  default:
    "I'm here to help with ReWear questions! You can ask me about:\n\n• Listing items\n• The point system\n• Making swaps\n• Platform rules\n• Sustainability tips\n• Account management\n\nWhat would you like to know? 😊",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chatbot opens
      const welcomeMessage: Message = {
        id: "welcome",
        text: BOT_RESPONSES.greeting,
        isBot: true,
        timestamp: new Date(),
        suggestions: QUICK_ACTIONS.slice(0, 3),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim()

    // Check for exact matches first
    if (BOT_RESPONSES[message as keyof typeof BOT_RESPONSES]) {
      return BOT_RESPONSES[message as keyof typeof BOT_RESPONSES]
    }

    // Check for partial matches
    if (message.includes("list") || message.includes("add") || message.includes("upload")) {
      return BOT_RESPONSES["how do i list an item"]
    }
    if (message.includes("point") || message.includes("credit")) {
      return BOT_RESPONSES["how does the point system work"]
    }
    if (message.includes("swap") || message.includes("trade") || message.includes("exchange")) {
      return BOT_RESPONSES["how to request a swap"]
    }
    if (message.includes("not allowed") || message.includes("forbidden") || message.includes("banned")) {
      return BOT_RESPONSES["what items are not allowed"]
    }
    if (message.includes("rating") || message.includes("reputation") || message.includes("review")) {
      return BOT_RESPONSES["how to increase my rating"]
    }
    if (message.includes("sustain") || message.includes("environment") || message.includes("eco")) {
      return BOT_RESPONSES["sustainability tips"]
    }
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return BOT_RESPONSES.greeting
    }

    return BOT_RESPONSES.default
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = getBotResponse(messageText)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isBot: true,
          timestamp: new Date(),
          suggestions: messageText.toLowerCase().includes("help") ? QUICK_ACTIONS.slice(0, 4) : undefined,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm">ReBot Assistant</CardTitle>
            <p className="text-xs text-green-100">Always here to help! 🌱</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}>
                  {message.isBot && (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-green-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.isBot ? "bg-gray-100 text-gray-900" : "bg-green-600 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className={`text-xs mt-1 ${message.isBot ? "text-gray-500" : "text-green-100"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {!message.isBot && (
                    <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {message.suggestions && (
                  <div className="flex flex-wrap gap-1 ml-8">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-green-50 text-xs"
                        onClick={() => handleSendMessage(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-green-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="p-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1">
              {QUICK_ACTIONS.slice(0, 3).map((action, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-50 text-xs"
                  onClick={() => handleSendMessage(action)}
                >
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about ReWear..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
