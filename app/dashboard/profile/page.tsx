"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Plane, Camera, Settings, Share2, Trophy, Globe } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useUser()

  const stats = {
    tripsCompleted: 12,
    countriesVisited: 8,
    photosShared: 156,
    placesLiked: 89,
    totalMiles: 45230,
    favoriteDestination: "Japan",
  }

  const achievements = [
    { id: 1, name: "First Trip", description: "Completed your first trip", icon: Plane, earned: true },
    { id: 2, name: "Globe Trotter", description: "Visited 5 countries", icon: Globe, earned: true },
    { id: 3, name: "Photo Enthusiast", description: "Shared 100 photos", icon: Camera, earned: true },
    { id: 4, name: "Explorer", description: "Visited 10 countries", icon: MapPin, earned: false },
    { id: 5, name: "Travel Master", description: "Completed 20 trips", icon: Trophy, earned: false },
  ]

  const recentTrips = [
    {
      id: 1,
      destination: "Tokyo, Japan",
      date: "Dec 2024",
      image: "/placeholder.svg?height=100&width=150",
      status: "completed",
    },
    {
      id: 2,
      destination: "Santorini, Greece",
      date: "Aug 2024",
      image: "/placeholder.svg?height=100&width=150",
      status: "completed",
    },
    {
      id: 3,
      destination: "Machu Picchu, Peru",
      date: "Jun 2024",
      image: "/placeholder.svg?height=100&width=150",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <User className="h-8 w-8 text-blue-600" />
            <span>My Profile</span>
          </h1>
          <p className="text-muted-foreground mt-2">Your travel journey and achievements</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
          <Button asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <CardDescription className="flex items-center justify-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>New York, USA</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Travel Bio</p>
              <p className="text-sm">
                Passionate traveler exploring the world one destination at a time. Love discovering new cultures, trying
                local cuisines, and capturing memories through photography.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.tripsCompleted}</p>
                <p className="text-xs text-muted-foreground">Trips</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.countriesVisited}</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.photosShared}</p>
                <p className="text-xs text-muted-foreground">Photos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.placesLiked}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Travel Level</span>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Explorer</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Total Miles: {stats.totalMiles.toLocaleString()}</p>
                <p>Favorite: {stats.favoriteDestination}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Travel Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Statistics</CardTitle>
              <CardDescription>Your travel journey by the numbers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Plane className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.tripsCompleted}</p>
                  <p className="text-sm text-blue-600">Trips Completed</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">{stats.countriesVisited}</p>
                  <p className="text-sm text-green-600">Countries Visited</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{stats.photosShared}</p>
                  <p className="text-sm text-purple-600">Photos Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription>Unlock badges as you explore the world</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      achievement.earned
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        achievement.earned
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      }`}
                    >
                      <achievement.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium text-sm ${
                          achievement.earned ? "text-green-800 dark:text-green-200" : "text-gray-500"
                        }`}
                      >
                        {achievement.name}
                      </h4>
                      <p
                        className={`text-xs ${
                          achievement.earned ? "text-green-600 dark:text-green-400" : "text-gray-400"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Trips</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/trips">View All</Link>
                </Button>
              </CardTitle>
              <CardDescription>Your latest travel adventures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recentTrips.map((trip) => (
                  <div key={trip.id} className="group cursor-pointer">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                      <img
                        src={trip.image || "/placeholder.svg"}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="font-medium text-sm">{trip.destination}</h4>
                    <p className="text-xs text-muted-foreground">{trip.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
