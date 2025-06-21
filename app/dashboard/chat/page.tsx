"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, MapPin, Calendar, DollarSign, Loader2, AlertCircle, Car, Home, Utensils } from "lucide-react"
import { useChat } from "ai/react"
import { Textarea } from "@/components/ui/textarea"
interface QuickQuestion {
  id: string
  text: string
  icon: React.ReactNode
}

interface LocationData {
  latitude: number | null
  longitude: number | null
  city: string | null
  country: string | null
  loading: boolean
  error: string | null
  hasPermission: boolean
}

// Function to get region-specific currency info
function getRegionCurrency(country: string) {
  const currencyMap: Record<string, { symbol: string; code: string }> = {
    India: { symbol: "₹", code: "INR" },
    "United States": { symbol: "$", code: "USD" },
    "United Kingdom": { symbol: "£", code: "GBP" },
    Canada: { symbol: "C$", code: "CAD" },
    Australia: { symbol: "A$", code: "AUD" },
    Germany: { symbol: "€", code: "EUR" },
    France: { symbol: "€", code: "EUR" },
    Japan: { symbol: "¥", code: "JPY" },
    China: { symbol: "¥", code: "CNY" },
    Brazil: { symbol: "R$", code: "BRL" },
    Singapore: { symbol: "S$", code: "SGD" },
    "South Korea": { symbol: "₩", code: "KRW" },
    Thailand: { symbol: "฿", code: "THB" },
    Malaysia: { symbol: "RM", code: "MYR" },
    "United Arab Emirates": { symbol: "د.إ", code: "AED" },
  }
  return currencyMap[country] || { symbol: "$", code: "USD" }
}

// Enhanced message formatting component
function FormattedMessage({ content }: { content: string }) {
  // Parse and format the message content
  const formatContent = (text: string) => {
    const lines = text.replace("**","").split("\n")
    const elements: React.ReactNode[] = []
    let currentIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (!line) {
        elements.push(<div key={currentIndex++} className="h-2" />)
        continue
      }

      // Main headings (###)
      if (line.startsWith("### ")) {
        elements.push(
          <div key={currentIndex++} className="mb-4 mt-6">
            <h3 className="text-lg font-bold text-blue-700 border-b-2 border-blue-200 pb-2">
              {line.replace("### ", "")}
            </h3>
          </div>,
        )
        continue
      }

      // Destination headers with ** formatting
      if (line.includes("**") && line.includes("km")) {
        const parts = line.split("**")
        if (parts.length >= 3) {
          const placeName = parts[1].replace("**","")
          const details = parts[2].replace(":", "").trim()

          elements.push(
            <div
              key={currentIndex++}
              className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-800">{placeName}</h4>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  <span>{details}</span>
                </div>
              </div>
            </div>,
          )
          continue
        }
      }

      // Cost breakdown items
      if (line.includes("Accommodation:") || line.includes("Food:") || line.includes("Transportation:")) {
        const [category, cost] = line.replace("**","").split(":")
        let icon = <Home className="h-4 w-4" />
        let bgColor = "bg-green-50"
        let textColor = "text-green-700"

        if (category.includes("Food")) {
          icon = <Utensils className="h-4 w-4" />
          bgColor = "bg-orange-50"
          textColor = "text-orange-700"
        } else if (category.includes("Transportation")) {
          icon = <Car className="h-4 w-4" />
          bgColor = "bg-purple-50"
          textColor = "text-purple-700"
        }

        elements.push(
          <div key={currentIndex++} className={`flex items-center gap-3 p-3 ${bgColor} rounded-md mb-2`}>
            <div className={textColor}>{icon}</div>
            <div className="flex-1">
              <span className="font-medium text-gray-700">{category.replace("- ", "").replace("**","").trim()}:</span>
              <span className={`ml-2 font-bold ${textColor}`}>{cost.trim()}</span>
            </div>
          </div>,
        )
        continue
      }

      // Budget breakdown section
      if (line.startsWith("### Budget Breakdown") || line.includes("Budget Breakdown")) {
        elements.push(
          <div key={currentIndex++} className="mb-4 mt-6">
            <h3 className="text-lg font-bold text-green-700 border-b-2 border-green-200 pb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Breakdown
            </h3>
          </div>,
        )
        continue
      }

      // Regular bullet points
      if (line.startsWith("- ")) {
        const content = line.replace("- ", "").replace("**","").trim()
        elements.push(
          <div key={currentIndex++} className="flex items-start gap-2 mb-2 pl-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 leading-relaxed">{content}</span>
          </div>,
        )
        continue
      }

      // Numbered lists
      if (/^\d+\./.test(line)) {
        const content = line.replace(/^\d+\.\s*/, "").replace("**","").trim()
        elements.push(
          <div key={currentIndex++} className="flex items-start gap-3 mb-3 p-3 bg-blue-50 rounded-md">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {line.match(/^\d+/)?.[0]}
            </div>
            <span className="text-gray-700 leading-relaxed">{content}</span>
          </div>,
        )
        continue
      }

      // Regular paragraphs
      if (line.length > 0) {
        elements.push(
          <p key={currentIndex++} className="text-gray-700 leading-relaxed mb-3">
            {line}
          </p>,
        )
      }
    }

    return elements
  }

  return <div className="space-y-1">{formatContent(content)}</div>
}

export default function ChatPage() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    loading: false,
    error: null,
    hasPermission: false,
  })

  const [showLocationPrompt, setShowLocationPrompt] = useState(true)

  // Get user's location
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by this browser",
      }))
      return
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                "User-Agent": "TravelApp/1.0",
              },
            },
          )

          if (!response.ok) {
            throw new Error("Geocoding service unavailable")
          }

          const data = await response.json()

          setLocation({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || "Unknown City",
            country: data.address?.country || "Unknown Country",
            loading: false,
            error: null,
            hasPermission: true,
          })
          setShowLocationPrompt(false)
        } catch (error) {
          console.error("Error getting location details:", error)
          setLocation({
            latitude,
            longitude,
            city: "Unknown City",
            country: "Unknown Country",
            loading: false,
            error: null,
            hasPermission: true,
          })
          setShowLocationPrompt(false)
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. You can still use the chat without location features."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
          default:
            errorMessage = "An unknown error occurred while retrieving location."
            break
        }

        console.error("Geolocation error:", error)
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          hasPermission: false,
        }))
        setShowLocationPrompt(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 600000,
      },
    )
  }

  const getWelcomeMessage = () => {
    if (location.hasPermission && location.city && location.country) {
      const currency = getRegionCurrency(location.country)
      return `Hello! I'm your AI travel assistant. I can see you're in ${location.city}, ${location.country}. I can help you plan trips with distance-based recommendations, suggest places within specific travel times, and create itineraries with costs in ${currency.code} (${currency.symbol}). What would you like to explore today?`
    } else {
      return "Hello! I'm your AI travel assistant. I can help you plan trips, suggest destinations, and create itineraries based on your preferences. What would you like to explore today?"
    }
  }

  // Get region-specific quick questions
  const getQuickQuestions = (): QuickQuestion[] => {
    if (location.hasPermission && location.country) {
      const currency = getRegionCurrency(location.country)
      const budgetAmount = location.country === "India" ? "5000" : "1000"

      return [
        {
          id: "budget",
          text: `Plan a trip under ${currency.symbol}${budgetAmount}`,
          icon: <DollarSign className="h-4 w-4" />,
        },
        {
          id: "weekend",
          text: "Weekend getaway ideas within 500km",
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          id: "nearby",
          text: "Best places to visit within 200km",
          icon: <MapPin className="h-4 w-4" />,
        },
      ]
    }

    return [
      {
        id: "budget",
        text: "Plan a trip under $1000",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        id: "weekend",
        text: "Weekend getaway ideas",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: "nearby",
        text: "Best places to visit nearby",
        icon: <MapPin className="h-4 w-4" />,
      },
    ]
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(),
      },
    ],
    body: {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        country: location.country,
        hasLocation: location.hasPermission,
      },
      preferences: {
        style: "adventure",
        budgetLabel: "moderate",
        duration: "1 week",
      },
    },
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleQuickQuestion = (question: string) => {
    const syntheticEvent = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(syntheticEvent)

    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    }, 100)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>Travel Assistant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              {location.loading ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting location...</span>
                </div>
              ) : location.hasPermission && location.city ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {location.city}, {location.country}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {getRegionCurrency(location.country).code}
                  </span>
                </div>
              ) : showLocationPrompt ? (
                <Button onClick={requestLocation} variant="outline" size="sm" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Enable Location</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Location unavailable</span>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    ) : (
                      <FormattedMessage content={message.content} />
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Location Error Message */}
          {location.error && (
            <div className="p-4 border-t bg-yellow-50 border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{location.error}</p>
              </div>
            </div>
          )}

          {/* Quick Questions */}
          {messages.length <= 1 && !location.loading && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">
                {location.hasPermission && location.city
                  ? `Quick questions for ${location.city} (${getRegionCurrency(location.country).code}):`
                  : "Quick questions to get started:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {getQuickQuestions().map((question) => (
                  <Button
                    key={question.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question.text)}
                    className="flex items-center space-x-2"
                  >
                    {question.icon}
                    <span>{question.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder={
                  location.hasPermission && location.city
                    ? `Ask about destinations from ${location.city}, costs in ${getRegionCurrency(location.country).code}...`
                    : "Ask about destinations, budgets, travel plans..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
