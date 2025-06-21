"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, Plus, X, Save, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Trip } from "@/lib/db"
import { toast } from "@/hooks/use-toast"

const TRAVEL_STYLES = ["adventure", "relaxation", "cultural", "business", "family", "romantic", "solo", "group"]

const BUDGET_RANGES = ["budget", "mid-range", "luxury", "ultra-luxury"]

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL"]

const INTEREST_SUGGESTIONS = [
  "Museums",
  "Food & Dining",
  "Nightlife",
  "Shopping",
  "Nature",
  "Adventure Sports",
  "History",
  "Art",
  "Music",
  "Photography",
  "Architecture",
  "Local Culture",
  "Beaches",
  "Mountains",
  "Cities",
  "Wildlife",
  "Festivals",
  "Wellness",
]

export default function EditTripPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [trip, setTrip] = useState<Trip | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    travelers: 1,
    budget: "",
    travelStyle: "",
    currency: "USD",
    interests: [] as string[],
  })

  const [newInterest, setNewInterest] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchTrip(params.id as string)
    }
  }, [params.id])

  const fetchTrip = async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Trip not found",
            description: "The trip you're trying to edit doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard/trips")
          return
        }
        throw new Error("Failed to fetch trip")
      }
      const data = await response.json()
      const tripData = data.trip
      setTrip(tripData)

      // Populate form with existing data
      setFormData({
        title: tripData.title,
        destination: tripData.destination,
        description: tripData.description || "",
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
        travelers: tripData.travelers,
        budget: tripData.budget,
        travelStyle: tripData.travelStyle,
        currency: tripData.currency,
        interests: tripData.interests,
      })
    } catch (error) {
      console.error("Error fetching trip:", error)
      toast({
        title: "Error",
        description: "Failed to load trip details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trip) return

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a trip title.",
        variant: "destructive",
      })
      return
    }

    if (!formData.destination.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a destination.",
        variant: "destructive",
      })
      return
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please select both start and end dates.",
        variant: "destructive",
      })
      return
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update trip")
      }

      toast({
        title: "Success!",
        description: "Trip updated successfully.",
      })

      router.push(`/dashboard/trips/${trip.id}`)
    } catch (error) {
      console.error("Error updating trip:", error)
      toast({
        title: "Error",
        description: "Failed to update trip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  const addSuggestedInterest = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Trip not found</h3>
        <p className="text-muted-foreground mb-4">The trip you're trying to edit doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/trips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/trips/${trip.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Trip</h1>
          <p className="text-muted-foreground">Update your trip details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Trip Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="My Amazing Trip"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  placeholder="Paris, France"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about your trip..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, travelers: Number.parseInt(e.target.value) || 1 }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((budget) => (
                        <SelectItem key={budget} value={budget}>
                          {budget.charAt(0).toUpperCase() + budget.slice(1).replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Travel Style</Label>
                <Select
                  value={formData.travelStyle}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interests & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add Custom Interest</Label>
              <div className="flex space-x-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Enter an interest..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                />
                <Button type="button" onClick={addInterest}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.interests.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="flex items-center space-x-1">
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Suggested Interests</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_SUGGESTIONS.filter((interest) => !formData.interests.includes(interest)).map((interest) => (
                  <Badge
                    key={interest}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => addSuggestedInterest(interest)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/trips/${trip.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
