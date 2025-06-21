"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPin, Users, DollarSign, Plane, Plus, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface TripFormData {
  title: string
  destination: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
  travelers: number
  budget: string
  travelStyle: string
  interests: string[]
}

export default function NewTripPage() {
  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    destination: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
    travelers: 1,
    budget: "",
    travelStyle: "",
    interests: [],
  })
  const [newInterest, setNewInterest] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const interestSuggestions = [
    "Culture & History",
    "Food & Dining",
    "Adventure Sports",
    "Nature & Wildlife",
    "Photography",
    "Shopping",
    "Nightlife",
    "Museums",
    "Beaches",
    "Mountains",
    "Architecture",
    "Local Markets",
  ]

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }))
    }
    setNewInterest("")
  }

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.destination || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "planning",
          currency: "USD",
          totalCost: 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create trip")
      }

      const data = await response.json()

      toast({
        title: "Trip created!",
        description: `${formData.title} has been added to your trips.`,
      })

      router.push(`/dashboard/trips/${data.trip.id}`)
    } catch (error) {
      toast({
        title: "Error creating trip",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Plane className="h-8 w-8 text-blue-600" />
            <span>Plan New Trip</span>
          </h1>
          <p className="text-muted-foreground mt-2">Create a detailed itinerary for your next adventure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Trip Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Adventure in Japan"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Tokyo, Japan"
                    value={formData.destination}
                    onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want to do on this trip..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dates and Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>When and how are you traveling?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Select
                      value={formData.travelers.toString()}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, travelers: Number.parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Person" : "People"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget ($500-1500)</SelectItem>
                        <SelectItem value="mid-range">Mid-range ($1500-3000)</SelectItem>
                        <SelectItem value="luxury">Luxury ($3000-6000)</SelectItem>
                        <SelectItem value="ultra-luxury">Ultra Luxury ($6000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelStyle">Travel Style</Label>
                  <Select
                    value={formData.travelStyle}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your travel style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="relaxation">Relaxation</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="family">Family-friendly</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests & Activities</CardTitle>
                <CardDescription>What are you interested in doing?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="flex items-center space-x-1">
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add custom interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addInterest(newInterest)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addInterest(newInterest)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-2 block">Popular Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {interestSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addInterest(suggestion)}
                        disabled={formData.interests.includes(suggestion)}
                        className="h-8 text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
                <CardDescription>Review your trip details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formData.destination || "Destination not set"}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formData.startDate && formData.endDate
                        ? `${format(formData.startDate, "MMM d")} - ${format(formData.endDate, "MMM d, yyyy")}`
                        : "Dates not set"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formData.travelers} {formData.travelers === 1 ? "traveler" : "travelers"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formData.budget || "Budget not set"}</span>
                  </div>
                </div>

                {formData.interests.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Selected Interests</Label>
                      <div className="flex flex-wrap gap-1">
                        {formData.interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Trip...
                    </>
                  ) : (
                    <>
                      <Plane className="mr-2 h-4 w-4" />
                      Create Trip
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
