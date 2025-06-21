"use client"

import { useState, useEffect } from "react"

interface LocationData {
  latitude: number | null
  longitude: number | null
  city: string | null
  country: string | null
  loading: boolean
  error: string | null
  hasPermission: boolean
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    loading: false,
    error: null,
    hasPermission: false,
  })

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
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 600000,
      },
    )
  }

  // Auto-request location on first load
  useEffect(() => {
    requestLocation()
  }, [])

  return {
    location,
    requestLocation,
    refreshLocation: requestLocation,
  }
}
