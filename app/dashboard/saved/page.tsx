"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Search,
  MapPin,
  Star,
  DollarSign,
  MoreHorizontal,
  Eye,
  Trash2,
  Share2,
  Calendar,
  Plane,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddPlaceDialog } from "@/components/add-place-dialog"

interface SavedPlace {
  id: string
  name: string
  type: string
  location: string
  country: string
  rating: number
  priceRange: string
  description: string
  image: string
  tags: string[]
  status: "wishlist" | "visited" | "planning"
  savedDate: string
  visitDate?: string
  notes?: string
}

export default function SavedPlacesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSavedPlaces = async () => {
    try {
      const response = await fetch("/api/saved-places")
      const data = await response.json()
      setSavedPlaces(data.savedPlaces || [])
    } catch (error) {
      console.error("Error fetching saved places:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedPlaces()
  }, [])

  const filteredPlaces = savedPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || place.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "wishlist":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "visited":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "wishlist":
        return <Heart className="h-3 w-3" />
      case "planning":
        return <Calendar className="h-3 w-3" />
      case "visited":
        return <Plane className="h-3 w-3" />
      default:
        return <Heart className="h-3 w-3" />
    }
  }

  const statusCounts = {
    all: savedPlaces.length,
    wishlist: savedPlaces.filter((p) => p.status === "wishlist").length,
    planning: savedPlaces.filter((p) => p.status === "planning").length,
    visited: savedPlaces.filter((p) => p.status === "visited").length,
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
            <Heart className="h-8 w-8 text-red-600" />
            <span>Saved Places</span>
          </h1>
          <p className="text-muted-foreground mt-2">Your collection of dream destinations and favorite spots</p>
        </div>
        <AddPlaceDialog onPlaceAdded={fetchSavedPlaces} />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved places by name, location, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist ({statusCounts.wishlist})</TabsTrigger>
                <TabsTrigger value="planning">Planning ({statusCounts.planning})</TabsTrigger>
                <TabsTrigger value="visited">Visited ({statusCounts.visited})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Total Saved</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">{savedPlaces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Wishlist</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{statusCounts.wishlist}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Visited</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">{statusCounts.visited}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Countries</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {new Set(savedPlaces.map((p) => p.country)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Places Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <Badge className={getStatusColor(place.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(place.status)}
                    <span className="capitalize">{place.status}</span>
                  </div>
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{place.name}</CardTitle>
              <CardDescription className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {place.location}, {place.country}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {place.type}
                </Badge>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{place.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{place.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{place.priceRange}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Saved {new Date(place.savedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {place.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {place.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{place.tags.length - 3}
                  </Badge>
                )}
              </div>

              {place.notes && (
                <div className="bg-muted/50 rounded-lg p-2 mb-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    <strong>Notes:</strong> {place.notes}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <Button size="sm" className="flex-1">
                  {place.status === "wishlist" ? "Plan Trip" : place.status === "planning" ? "View Plans" : "View Trip"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No saved places found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Start saving places you'd love to visit"}
            </p>
            {!searchQuery && <AddPlaceDialog onPlaceAdded={fetchSavedPlaces} />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
