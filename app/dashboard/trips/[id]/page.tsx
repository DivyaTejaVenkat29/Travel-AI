"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Plane,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Edit,
  Share2,
  Download,
  ArrowLeft,
  Hotel,
  Camera,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import type { Trip } from "@/lib/db"
import { toast } from "@/hooks/use-toast"

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

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
            description: "The trip you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard/trips")
          return
        }
        throw new Error("Failed to fetch trip")
      }
      const data = await response.json()
      setTrip(data.trip)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "booked":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Clock className="h-4 w-4" />
      case "booked":
        return <Calendar className="h-4 w-4" />
      case "completed":
        return <Plane className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const calculateProgress = () => {
    if (!trip) return 0
    const today = new Date()
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)

    if (today < start) return 0
    if (today > end) return 100

    const totalDays = differenceInDays(end, start)
    const daysPassed = differenceInDays(today, start)
    return Math.round((daysPassed / totalDays) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Trip not found</h3>
        <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/trips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Link>
        </Button>
      </div>
    )
  }

  const tripDuration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1
  const progress = calculateProgress()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/trips">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Trips
              </Link>
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
              <Badge className={getStatusColor(trip.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(trip.status)}
                  <span className="capitalize">{trip.status}</span>
                </div>
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/trips/${trip.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Trip
            </Link>
          </Button>
        </div>
      </div>

      {/* Trip Progress */}
      {trip.status === "booked" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trip Progress</span>
                <span>{progress}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{format(new Date(trip.startDate), "MMM d, yyyy")}</span>
                <span>{format(new Date(trip.endDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-2xl font-bold">{tripDuration}</p>
                <p className="text-xs text-muted-foreground">{tripDuration === 1 ? "day" : "days"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Travelers</p>
                <p className="text-2xl font-bold">{trip.travelers}</p>
                <p className="text-xs text-muted-foreground">{trip.travelers === 1 ? "person" : "people"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-2xl font-bold capitalize">{trip.budget}</p>
                <p className="text-xs text-muted-foreground">
                  {trip.totalCost ? `$${trip.totalCost.toLocaleString()}` : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Style</p>
                <p className="text-2xl font-bold capitalize">{trip.travelStyle}</p>
                <p className="text-xs text-muted-foreground">Travel type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="memories">Memories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{trip.description || "No description provided."}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Travel Dates</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Departure:</span>
                      <span>{format(new Date(trip.startDate), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return:</span>
                      <span>{format(new Date(trip.endDate), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Travel Preferences</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="capitalize">{trip.travelStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="capitalize">{trip.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span className="uppercase">{trip.currency}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests & Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {trip.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {trip.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No interests specified.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Itinerary
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trip.itinerary && trip.itinerary.length > 0 ? (
                <div className="space-y-6">
                  {trip.itinerary.map((day, index) => (
                    <div key={day.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">
                          Day {day.day} - {format(new Date(day.date), "MMMM d, yyyy")}
                        </h3>
                        <Badge variant="outline">${day.totalDayCost}</Badge>
                      </div>

                      {day.accommodation && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Hotel className="h-4 w-4" />
                            <span className="font-medium">Accommodation</span>
                          </div>
                          <p className="text-sm">{day.accommodation.name}</p>
                          <p className="text-xs text-muted-foreground">{day.accommodation.address}</p>
                        </div>
                      )}

                      {day.activities.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Activities</h4>
                          {day.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{activity.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">${activity.cost}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No itinerary yet</h3>
                  <p className="text-muted-foreground mb-4">Start planning your daily activities</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Itinerary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Budget tracking coming soon</h3>
                <p className="text-muted-foreground">Track your expenses and stay within budget</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Trip Memories
                <Button size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Memory
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No memories yet</h3>
                <p className="text-muted-foreground mb-4">Start capturing your travel moments</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
