"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw, Navigation, Globe, Clock, Loader2, Utensils, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TravelResponse } from "@/components/response-rendered"

interface LocationData {
  latitude: number
  longitude: number
  city?: string
  region?: string
  country?: string
  timezone?: string
  hasLocation: boolean
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function LocationPage() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatResponse, setChatResponse] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const [preferences] = useState({
    style: "adventure",
    budgetLabel: "$$",
    duration: "3 days",
  })

  const getBrowserLocation = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Use reverse geocoding to get location details
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          const locationData = await response.json()

          setLocation({
            latitude,
            longitude,
            city: locationData.city || locationData.locality || "Unknown City",
            region: locationData.principalSubdivision || locationData.region || "",
            country: locationData.countryName || "Unknown Country",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hasLocation: true,
          })
        } catch (geocodeError) {
          console.error("Geocoding error:", geocodeError)
          // Use fallback location data
          setLocation({
            latitude,
            longitude,
            city: "Unknown City",
            region: "",
            country: "Unknown Country",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hasLocation: true,
          })
        }

        setLoading(false)
      },
      (err) => {
        console.error("Error getting geolocation", err)
        setError("Unable to retrieve your location. Please allow location access.")
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      },
    )
  }

  useEffect(() => {
    getBrowserLocation()
  }, [])

  const cleanStreamingResponse = (text: string): string => {
    return (
      text
        // Remove various metadata patterns
        .replace(/f:\{[^}]*\}/g, "")
        .replace(/e:\{[^}]*\}/g, "")
        .replace(/d:\{[^}]*\}/g, "")
        .replace(/,"isContinued":[^}]*\}\}/g, "")
        .replace(/\}\}$/g, "")
        // Convert \n to actual line breaks
        .replace(/\\n/g, "\n")
        // Remove any trailing commas or incomplete JSON
        .replace(/,\s*$/, "")
        // Clean up extra whitespace
        .trim()
    )
  }

  const handleChatAction = async (intent: string) => {
    if (!location) {
      setError("Location not available. Please refresh your location first.")
      return
    }

    setChatLoading(true)
    setChatResponse("")
    setError(null)
    setActiveAction(intent)

    const newMessage: ChatMessage = {
      role: "user",
      content: `I want to ${intent.toLowerCase()}.`,
    }

    const messagesToSend = [...chatMessages, newMessage]
    setChatMessages(messagesToSend)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend,
          location,
          preferences,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      if (!res.body) {
        throw new Error("No response body received")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullResponse = ""
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          if (value) {
            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk

            // Handle different streaming formats
            let processedText = ""

            // Format 1: Vercel AI SDK format: 0:"text"0:"more text"
            const vercelMatches = buffer.match(/\d+:"([^"]*)"/g)
            if (vercelMatches) {
              for (const match of vercelMatches) {
                const textMatch = match.match(/\d+:"([^"]*)"/)
                if (textMatch && textMatch[1]) {
                  processedText += textMatch[1]
                }
              }
              // Remove processed parts from buffer
              buffer = buffer.replace(/\d+:"[^"]*"/g, "")
            } else {
              // Format 2: Plain text with potential metadata
              processedText = buffer
              buffer = ""
            }

            if (processedText) {
              const cleanedText = cleanStreamingResponse(processedText)
              if (cleanedText) {
                fullResponse += cleanedText
                setChatResponse(fullResponse)
              }
            }
          }
        }

        // Final cleanup of any remaining buffer
        if (buffer.trim()) {
          const finalCleanedText = cleanStreamingResponse(buffer)
          if (finalCleanedText) {
            fullResponse += finalCleanedText
            setChatResponse(fullResponse)
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Add the complete response to chat history
      if (fullResponse.trim()) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: fullResponse }])
      }
    } catch (err) {
      console.error("Chat API error:", err)
      setError(
        `Failed to fetch travel assistant response: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`,
      )
    } finally {
      setChatLoading(false)
      setActiveAction(null)
    }
  }

  const clearChat = () => {
    setChatMessages([])
    setChatResponse("")
    setActiveAction(null)
    setError(null)
  }

  const getActionIcon = (action: string) => {
    if (action.includes("Attractions")) return <MapPin className="h-4 w-4" />
    if (action.includes("Itinerary")) return <Calendar className="h-4 w-4" />
    if (action.includes("Cuisine")) return <Utensils className="h-4 w-4" />
    return <Globe className="h-4 w-4" />
  }

  const getActionColor = (action: string) => {
    if (action.includes("Attractions")) return "bg-blue-500"
    if (action.includes("Itinerary")) return "bg-purple-500"
    if (action.includes("Cuisine")) return "bg-orange-500"
    return "bg-purple-500"
  }

  const getRegionCurrency = (country: string) => {
    const regionMap: Record<string, string> = {
      India: "₹",
      "United States": "$",
      "United Kingdom": "£",
      Canada: "C$",
      Australia: "A$",
      Germany: "€",
      France: "€",
      Japan: "¥",
      China: "¥",
      Brazil: "R$",
      Mexico: "$",
      Singapore: "S$",
      "South Korea": "₩",
      Thailand: "฿",
      Malaysia: "RM",
      Indonesia: "Rp",
      Philippines: "₱",
      "South Africa": "R",
      Nigeria: "₦",
      Egypt: "E£",
      "United Arab Emirates": "د.إ",
      "Saudi Arabia": "﷼",
      Turkey: "₺",
      Russia: "₽",
    }
    return regionMap[country] || "$"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Travel Explorer
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover amazing places and experiences with region-specific recommendations
            </p>
          </div>
          <Button onClick={getBrowserLocation} disabled={loading} size="lg">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Location
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <MapPin className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Location Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                <span>Current Location</span>
              </CardTitle>
              <CardDescription>Your detected location and region info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Getting your location...</span>
                </div>
              ) : location ? (
                <div className="space-y-4">
                  {location.city && location.country && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-muted-foreground block">Location:</span>
                      <p className="font-semibold text-purple-700">
                        {location.city}, {location.country}
                      </p>
                    </div>
                  )}

                  {location.country && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <span className="text-muted-foreground block">Local Currency:</span>
                      <p className="font-semibold text-green-700 text-2xl">{getRegionCurrency(location.country)}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-muted-foreground block">Coordinates:</span>
                      <p className="font-mono font-semibold text-blue-700">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="w-full justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Location acquired • Ready for recommendations
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Click "Refresh Location" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI-Powered Location Actions</CardTitle>
              <CardDescription>
                Get personalized recommendations with local pricing and details
                {location?.country && ` • Prices in ${getRegionCurrency(location.country)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  {
                    action: "Find Nearby Attractions",
                    icon: MapPin,
                    desc: "Museums, landmarks & entertainment",
                    details: "Get specific locations with entry fees & timings",
                  },
                  {
                    action: "Plan Travel Itinerary",
                    icon: Calendar,
                    desc: "Custom trip planning & schedules",
                    details: "Day-by-day plans with transportation & timing",
                  },
                  {
                    action: "Explore Local Cuisine",
                    icon: Utensils,
                    desc: "Restaurants & local dishes",
                    details: "Food recommendations with price ranges",
                  },
                ].map(({ action, icon: Icon, desc, details }) => (
                  <Button
                    key={action}
                    className={`h-auto p-4 flex-col space-y-3 ${activeAction === action ? "ring-2 ring-blue-500" : ""}`}
                    variant="outline"
                    onClick={() => handleChatAction(action)}
                    disabled={!location || chatLoading}
                  >
                    <div className={`p-3 rounded-full ${getActionColor(action)} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="font-semibold text-sm">{action}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                      <div className="text-xs text-blue-600 font-medium">{details}</div>
                    </div>
                    {activeAction === action && chatLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </Button>
                ))}
              </div>

              {location && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Smart Features:</strong> All recommendations include local pricing in{" "}
                    <span className="font-bold">{getRegionCurrency(location.country)}</span>, distances from{" "}
                    {location.city}, and region-specific travel advice.
                  </p>
                </div>
              )}

              {chatMessages.length > 0 && (
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearChat}>
                    Clear History
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Response Area */}
        {(chatLoading || chatResponse) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {activeAction && getActionIcon(activeAction)}
                <span>{chatLoading ? "AI Travel Assistant is analyzing..." : "AI Travel Assistant"}</span>
                {location?.country && (
                  <Badge variant="secondary" className="ml-2">
                    {getRegionCurrency(location.country)} Pricing
                  </Badge>
                )}
              </CardTitle>
              {activeAction && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="w-fit">
                    {activeAction}
                  </Badge>
                  {location && (
                    <Badge variant="outline" className="w-fit">
                      {location.city}, {location.country}
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {chatLoading ? (
                <div className="flex items-center space-x-3 p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-muted-foreground">
                    Analyzing your location and finding personalized recommendations with local pricing...
                  </span>
                </div>
              ) : (
                <TravelResponse content={chatResponse} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Chat History */}
        {chatMessages.length > 1 && !chatLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>Your previous travel queries and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {chatMessages.slice(0, -1).map((message, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className={`p-3 rounded-lg ${message.role === "user" ? "bg-blue-100 ml-12" : "bg-gray-100 mr-12"}`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.role === "user" ? "You" : "AI Travel Assistant"}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {index < chatMessages.length - 2 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
