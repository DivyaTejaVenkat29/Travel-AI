import { type NextRequest, NextResponse } from "next/server"

interface GooglePlace {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  price_level?: number
  opening_hours?: {
    open_now: boolean
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  formatted_phone_number?: string
  website?: string
  formatted_address?: string
}

interface PlaceDetailsResponse {
  result: GooglePlace
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "5000"
    const type = searchParams.get("type") || "all"

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    // If no API key, return mock data
    if (!apiKey) {
      console.log("Google Places API key not found, using mock data")
      const mockPlaces = generateEnhancedMockPlaces(Number.parseFloat(lat), Number.parseFloat(lng), type)
      return NextResponse.json({
        places: mockPlaces,
        location: {
          lat: Number.parseFloat(lat),
          lng: Number.parseFloat(lng),
        },
        radius: Number.parseInt(radius),
        total: mockPlaces.length,
        source: "mock",
      })
    }

    // Try Google Places API
    try {
      const places = await fetchGooglePlaces(apiKey, lat, lng, radius, type)
      
      if (places.length > 0) {
        return NextResponse.json({
          places,
          location: {
            lat: Number.parseFloat(lat),
            lng: Number.parseFloat(lng),
          },
          radius: Number.parseInt(radius),
          total: places.length,
          source: "google",
        })
      }
    } catch (apiError) {
      console.error("Google Places API error:", apiError)
      // Fall back to mock data if API fails
    }

    // Fallback to enhanced mock data
    console.log("Falling back to mock data")
    const mockPlaces = generateEnhancedMockPlaces(Number.parseFloat(lat), Number.parseFloat(lng), type)
    
    return NextResponse.json({
      places: mockPlaces,
      location: {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      },
      radius: Number.parseInt(radius),
      total: mockPlaces.length,
      source: "mock",
    })

  } catch (error) {
    console.error("Error in places API:", error)
    return NextResponse.json({ error: "Failed to fetch nearby places" }, { status: 500 })
  }
}

async function fetchGooglePlaces(apiKey: string, lat: string, lng: string, radius: string, type: string) {
  // Map our categories to Google Places types
  const typeMapping: Record<string, string[]> = {
    restaurant: ["restaurant", "meal_takeaway", "cafe", "bakery"],
    attraction: ["tourist_attraction", "museum", "park", "zoo"],
    hotel: ["lodging"],
    activity: ["gym", "spa", "bowling_alley", "movie_theater"],
    all: ["restaurant", "tourist_attraction", "lodging", "museum", "park", "cafe"],
  }

  const searchTypes = typeMapping[type] || typeMapping.all
  const allPlaces: any[] = []

  // Search for each type
  for (const searchType of searchTypes.slice(0, 2)) {
    try {
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${searchType}&key=${apiKey}`

      const response = await fetch(placesUrl)
      const data = await response.json()

      if (data.status === "OK" && data.results) {
        // Get detailed information for each place
        const placesWithDetails = await Promise.all(
          data.results.slice(0, 5).map(async (place: GooglePlace) => {
            try {
              // Get place details for more information
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,opening_hours,photos,price_level,types,geometry&key=${apiKey}`

              const detailsResponse = await fetch(detailsUrl)
              const detailsData: PlaceDetailsResponse = await detailsResponse.json()

              if (detailsData.result) {
                return formatPlace(detailsData.result, { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) }, apiKey)
              }
              return formatPlace(place, { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) }, apiKey)
            } catch (error) {
              console.error("Error fetching place details:", error)
              return formatPlace(place, { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) }, apiKey)
            }
          }),
        )

        allPlaces.push(...placesWithDetails)
      } else if (data.status === "ZERO_RESULTS") {
        console.log(`No results for type: ${searchType}`)
      } else {
        console.error(`Google Places API error for ${searchType}:`, data.status, data.error_message)
      }
    } catch (error) {
      console.error(`Error searching for ${searchType}:`, error)
    }
  }

  // Remove duplicates and sort by distance
  const uniquePlaces = allPlaces
    .filter((place, index, self) => index === self.findIndex((p) => p.id === place.id))
    .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
    .slice(0, 20)

  return uniquePlaces
}

function formatPlace(place: GooglePlace, userLocation: { lat: number; lng: number }, apiKey?: string) {
  // Calculate distance
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    place.geometry.location.lat,
    place.geometry.location.lng,
  )

  // Determine category based on types
  const category = determineCategory(place.types)

  // Format price
  const price = formatPrice(place.price_level)

  // Get photo URL
  const photoUrl = place.photos?.[0] && apiKey
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
    : "/placeholder.svg?height=200&width=300"

  return {
    id: place.place_id,
    name: place.name,
    type: getPlaceType(place.types),
    rating: place.rating || 0,
    distance: `${distance.toFixed(1)} km`,
    price,
    description: generateDescription(place.name, place.types),
    image: photoUrl,
    isOpen: place.opening_hours?.open_now ?? true,
    category,
    address: place.formatted_address || place.vicinity,
    phone: place.formatted_phone_number,
    website: place.website,
    coordinates: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    },
  }
}

function generateEnhancedMockPlaces(lat: number, lng: number, type: string) {
  const mockPlaces = [
    {
      name: "Central Coffee House",
      type: "Cafe",
      category: "restaurant",
      price: "$$",
      rating: 4.5,
      description: "Cozy neighborhood coffee shop with artisanal brews and fresh pastries.",
      types: ["cafe", "food", "establishment"],
    },
    {
      name: "City Art Museum",
      type: "Museum",
      category: "attraction",
      price: "$15",
      rating: 4.7,
      description: "Contemporary art museum featuring local and international artists.",
      types: ["museum", "tourist_attraction", "establishment"],
    },
    {
      name: "Riverside Park",
      type: "Park",
      category: "attraction",
      price: "Free",
      rating: 4.3,
      description: "Beautiful riverside park with walking trails and picnic areas.",
      types: ["park", "tourist_attraction", "establishment"],
    },
    {
      name: "The Gourmet Bistro",
      type: "Restaurant",
      category: "restaurant",
      price: "$$$",
      rating: 4.6,
      description: "Fine dining restaurant with seasonal menu and wine pairings.",
      types: ["restaurant", "food", "establishment"],
    },
    {
      name: "Adventure Sports Center",
      type: "Activity Center",
      category: "activity",
      price: "$$",
      rating: 4.4,
      description: "Rock climbing, kayaking, and outdoor adventure activities.",
      types: ["gym", "establishment"],
    },
    {
      name: "Historic Downtown Hotel",
      type: "Hotel",
      category: "hotel",
      price: "$$$",
      rating: 4.2,
      description: "Boutique hotel in a restored historic building with modern amenities.",
      types: ["lodging", "establishment"],
    },
    {
      name: "Local Pizza Place",
      type: "Restaurant",
      category: "restaurant",
      price: "$$",
      rating: 4.4,
      description: "Authentic wood-fired pizza with fresh ingredients and friendly service.",
      types: ["restaurant", "meal_delivery", "establishment"],
    },
    {
      name: "Science Discovery Center",
      type: "Museum",
      category: "attraction",
      price: "$12",
      rating: 4.6,
      description: "Interactive science museum perfect for families and curious minds.",
      types: ["museum", "tourist_attraction", "establishment"],
    },
    {
      name: "Fitness Plus Gym",
      type: "Gym",
      category: "activity",
      price: "$$",
      rating: 4.1,
      description: "Modern fitness center with state-of-the-art equipment and classes.",
      types: ["gym", "health", "establishment"],
    },
    {
      name: "Sunset Viewpoint",
      type: "Scenic Spot",
      category: "attraction",
      price: "Free",
      rating: 4.8,
      description: "Perfect spot to watch the sunset with panoramic city views.",
      types: ["tourist_attraction", "establishment"],
    },
  ]

  return mockPlaces
    .filter((place) => type === "all" || place.category === type)
    .map((place, index) => ({
      id: `mock_${index}_${Date.now()}`,
      name: place.name,
      type: place.type,
      category: place.category as "restaurant" | "attraction" | "hotel" | "activity",
      rating: place.rating,
      distance: `${(Math.random() * 3 + 0.1).toFixed(1)} km`,
      price: place.price,
      description: place.description,
      image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(place.name)}`,
      isOpen: Math.random() > 0.2,
      address: `${Math.floor(Math.random() * 999) + 1} ${["Main St", "Oak Ave", "Park Blvd", "Center Dr", "First St", "Second Ave"][Math.floor(Math.random() * 6)]}`,
      phone: Math.random() > 0.4 ? `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      website: Math.random() > 0.5 ? `https://${place.name.toLowerCase().replace(/\s+/g, "")}.com` : undefined,
      coordinates: {
        lat: lat + (Math.random() - 0.5) * 0.02,
        lng: lng + (Math.random() - 0.5) * 0.02,
      },
    }))
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in kilometers
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

function determineCategory(types: string[]): "restaurant" | "attraction" | "hotel" | "activity" {
  if (types.some((type) => ["restaurant", "meal_takeaway", "meal_delivery", "cafe", "bakery", "bar"].includes(type))) {
    return "restaurant"
  }
  if (types.some((type) => ["tourist_attraction", "museum", "park", "zoo", "amusement_park"].includes(type))) {
    return "attraction"
  }
  if (types.some((type) => ["lodging"].includes(type))) {
    return "hotel"
  }
  if (
    types.some((type) => ["gym", "spa", "bowling_alley", "movie_theater", "night_club", "shopping_mall"].includes(type))
  ) {
    return "activity"
  }
  return "attraction" // Default
}

function getPlaceType(types: string[]): string {
  const typeMap: Record<string, string> = {
    restaurant: "Restaurant",
    cafe: "Cafe",
    bakery: "Bakery",
    bar: "Bar",
    tourist_attraction: "Attraction",
    museum: "Museum",
    park: "Park",
    zoo: "Zoo",
    amusement_park: "Amusement Park",
    lodging: "Hotel",
    gym: "Gym",
    spa: "Spa",
    bowling_alley: "Bowling Alley",
    movie_theater: "Cinema",
    night_club: "Night Club",
    shopping_mall: "Shopping Mall",
  }

  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type]
    }
  }

  return "Place"
}

function formatPrice(priceLevel?: number): string {
  if (priceLevel === undefined) return "N/A"

  switch (priceLevel) {
    case 0:
      return "Free"
    case 1:
      return "$"
    case 2:
      return "$$"
    case 3:
      return "$$$"
    case 4:
      return "$$$$"
    default:
      return "N/A"
  }
}

function generateDescription(name: string, types: string[]): string {
  const category = determineCategory(types)

  const descriptions: Record<string, string[]> = {
    restaurant: [
      "Delicious dining experience with great food and atmosphere.",
      "Popular local eatery known for quality and service.",
      "Highly rated restaurant with excellent reviews.",
    ],
    attraction: [
      "Must-visit destination with unique experiences.",
      "Popular attraction perfect for sightseeing.",
      "Interesting place to explore and discover.",
    ],
    hotel: [
      "Comfortable accommodation with great amenities.",
      "Well-rated lodging option for travelers.",
      "Quality hotel with excellent service.",
    ],
    activity: [
      "Fun activity perfect for entertainment and recreation.",
      "Great place for active pursuits and leisure.",
      "Popular venue for activities and events.",
    ],
  }

  const categoryDescriptions = descriptions[category] || descriptions.attraction
  const randomDescription = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]

  return randomDescription
}
