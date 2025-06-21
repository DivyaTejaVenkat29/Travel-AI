"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Search,
  Star,
  Clock,
  DollarSign,
  Navigation,
  Heart,
  Camera,
  Utensils,
  Loader2,
  AlertCircle,
  MapIcon,
  Phone,
  Globe,
  RefreshCw,
  Info,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Place {
  id: string
  name: string
  type: string
  rating: number
  distance: string
  price: string
  description: string
  image: string
  isOpen: boolean
  category: "restaurant" | "attraction" | "hotel" | "activity"
  address: string
  phone?: string
  website?: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface LocationData {
  city: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface PlacesResponse {
  places: Place[]
  location: { lat: number; lng: number }
  radius: number
  total: number
  source: "google" | "mock"
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"google" | "mock" | null>(null)
  const { toast } = useToast()

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser")
        setLocationLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords

            // Get location name from coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            )
            const data = await response.json()

            const locationData: LocationData = {
              city: data.city || data.locality || "Unknown City",
              country: data.countryName || "Unknown Country",
              coordinates: { lat: latitude, lng: longitude },
            }

            setLocation(locationData)
            setLocationLoading(false)

            // Fetch nearby places
            await fetchNearbyPlaces(latitude, longitude, selectedCategory)
          } catch (error) {
            console.error("Error getting location details:", error)
            setError("Failed to get location details")
            setLocationLoading(false)
            setLoading(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          let errorMessage = "Failed to get your location"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
          }

          setError(errorMessage)
          setLocationLoading(false)
          setLoading(false)

          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    }

    getCurrentLocation()
  }, [toast])

  // Fetch places when category changes
  useEffect(() => {
    if (location?.coordinates && !locationLoading) {
      fetchNearbyPlaces(location.coordinates.lat, location.coordinates.lng, selectedCategory)
    }
  }, [selectedCategory, location])

  // Fetch nearby places
  const fetchNearbyPlaces = async (lat: number, lng: number, category = "all") => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/places/nearby?lat=${lat}&lng=${lng}&radius=5000&type=${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch places")
      }

      const data: PlacesResponse = await response.json()
      setPlaces(data.places || [])
      setDataSource(data.source)

      const sourceMessage = data.source === "google" ? "from Google Places" : "sample places"
      toast({
        title: "Places Loaded",
        description: `Found ${data.places?.length || 0} ${sourceMessage}`,
      })
    } catch (error) {
      console.error("Error fetching places:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch nearby places"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh places
  const refreshPlaces = async () => {
    if (location?.coordinates) {
      setRefreshing(true)
      await fetchNearbyPlaces(location.coordinates.lat, location.coordinates.lng, selectedCategory)
      setRefreshing(false)
    }
  }

  // Filter places based on search
  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "restaurant":
        return <Utensils className="h-4 w-4" />
      case "attraction":
        return <Camera className="h-4 w-4" />
      case "hotel":
        return <MapPin className="h-4 w-4" />
      case "activity":
        return <Star className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "restaurant":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "attraction":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "hotel":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "activity":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const openInMaps = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`
    window.open(url, "_blank")
  }

  const openWebsite = (website: string) => {
    window.open(website, "_blank")
  }

  const callPhone = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Getting your location...</h3>
          <p className="text-muted-foreground">We need your location to find nearby places</p>
        </div>
      </div>
    )
  }

  if (error && !location) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Location Required</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Navigation className="h-8 w-8 text-purple-600" />
            <span>Explore Nearby</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover amazing places and experiences around you
            {location && (
              <span className="ml-2 text-purple-600 font-medium">
                in {location.city}, {location.country}
              </span>
            )}
          </p>
        </div>
        <Button onClick={refreshPlaces} disabled={loading || refreshing} variant="outline">
          {refreshing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <MapIcon className="h-4 w-4 mr-2" />}
          Refresh Places
        </Button>
      </div>

      {/* Data Source Info */}
      {dataSource && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {dataSource === "google"
                  ? "Showing real places from Google Places API"
                  : "Showing sample places (Google Places API not configured)"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for places, restaurants, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="restaurant">Food</TabsTrigger>
                <TabsTrigger value="attraction">Sights</TabsTrigger>
                <TabsTrigger value="activity">Activities</TabsTrigger>
                <TabsTrigger value="hotel">Hotels</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(place.category)}>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(place.category)}
                      <span className="capitalize">{place.category}</span>
                    </div>
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{place.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <span>{place.type}</span>
                      {place.rating > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{place.rating.toFixed(1)}</span>
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{place.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium">
                      <DollarSign className="h-3 w-3" />
                      <span>{place.price}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">{place.description}</p>
                <p className="text-xs text-muted-foreground mb-4">{place.address}</p>

                {/* Contact Information */}
                {(place.phone || place.website) && (
                  <div className="flex items-center space-x-4 mb-4">
                    {place.phone && (
                      <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => callPhone(place.phone!)}>
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="text-xs">Call</span>
                      </Button>
                    )}
                    {place.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => openWebsite(place.website!)}
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        <span className="text-xs">Website</span>
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm ${place.isOpen ? "text-green-600" : "text-red-600"}`}>
                      {place.isOpen ? "Open now" : "Closed"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openInMaps(place)}>
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredPlaces.length === 0 && places.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No places found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or category filters</p>
          </CardContent>
        </Card>
      )}

      {/* No Places Found */}
      {!loading && places.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <MapIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No places found nearby</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any places in your area. Try refreshing or check your location settings.
            </p>
            <Button onClick={refreshPlaces} disabled={refreshing}>
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
