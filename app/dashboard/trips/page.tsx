"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plane,
  Plus,
  Search,
  Calendar,
  Users,
  DollarSign,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"
import type { Trip } from "@/lib/db"

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips")
      const data = await response.json()
      setTrips(data.trips || [])
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTrip = async (tripId: string) => {
    try {
      await fetch(`/api/trips/${tripId}`, { method: "DELETE" })
      setTrips(trips.filter((trip) => trip.id !== tripId))
    } catch (error) {
      console.error("Error deleting trip:", error)
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "date":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      case "destination":
        return a.destination.localeCompare(b.destination)
      default:
        return 0
    }
  })

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
        return <Clock className="h-3 w-3" />
      case "booked":
        return <Calendar className="h-3 w-3" />
      case "completed":
        return <Plane className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const tripsByStatus = {
    all: trips.length,
    planning: trips.filter((t) => t.status === "planning").length,
    booked: trips.filter((t) => t.status === "booked").length,
    completed: trips.filter((t) => t.status === "completed").length,
    cancelled: trips.filter((t) => t.status === "cancelled").length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Plane className="h-8 w-8 text-blue-600" />
            <span>My Trips</span>
          </h1>
          <p className="text-muted-foreground mt-2">Plan, manage, and track all your travel adventures</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <TabsList className="grid w-full md:w-auto grid-cols-5">
            <TabsTrigger value="all">All ({tripsByStatus.all})</TabsTrigger>
            <TabsTrigger value="planning">Planning ({tripsByStatus.planning})</TabsTrigger>
            <TabsTrigger value="booked">Booked ({tripsByStatus.booked})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({tripsByStatus.completed})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({tripsByStatus.cancelled})</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="date">By Travel Date</SelectItem>
                <SelectItem value="destination">By Destination</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={statusFilter} className="space-y-6">
          {sortedTrips.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{searchQuery ? "No trips found" : "No trips yet"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start planning your first adventure!"}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/dashboard/trips/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Trip
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(trip.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(trip.status)}
                          <span className="capitalize">{trip.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trips/${trip.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trips/${trip.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Trip
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteTrip(trip.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Trip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{trip.title}</h3>
                      <p className="text-blue-100">{trip.destination}</p>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(trip.startDate), "MMM d")} -{" "}
                            {format(new Date(trip.endDate), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {trip.travelers} {trip.travelers === 1 ? "person" : "people"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="capitalize">{trip.budget}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {trip.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{trip.description}</p>
                    )}

                    {trip.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {trip.interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {trip.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{trip.interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/dashboard/trips/${trip.id}`}>View Details</Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/dashboard/trips/${trip.id}/edit`}>Edit Trip</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
