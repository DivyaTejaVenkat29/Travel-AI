"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar, TrendingUp, Plane, Heart, MapPin } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface UserStats {
  totalTrips: number
  completedTrips: number
  countriesVisited: number
  totalBudget: number
  savedPlaces: number
  conversations: number
}

interface UserActivity {
  id: string
  type: string
  title: string
  description: string
  createdAt: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user stats and activities
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/stats")
      const data = await response.json()
      setStats(data.stats)
      setActivities(data.activities || [])
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "trip_created":
        return <Plane className="h-4 w-4" />
      case "chat_started":
        return <MessageCircle className="h-4 w-4" />
      case "place_saved":
        return <Heart className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "trip_created":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "chat_started":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "place_saved":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "Traveler"}! 👋</h1>
        <p className="text-blue-100 mb-4">
          Ready to discover your next adventure? Let's plan something amazing together.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg">Start Travel Chat</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Ask our AI about destinations, budgets, and travel plans</CardDescription>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/chat">Chat Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg">Plan New Trip</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Create detailed itineraries with budget tracking</CardDescription>
            <Button asChild variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
              <Link href="/dashboard/trips/new">Start Planning</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg">Nearby Places</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Discover attractions and activities near you</CardDescription>
            <Button asChild variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
              <Link href="/dashboard/explore">Explore</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {loading ? "..." : stats?.totalTrips || 0}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">{stats?.completedTrips || 0} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Countries Visited</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {loading ? "..." : stats?.countriesVisited || 0}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Unique destinations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {loading ? "..." : `$${stats?.totalBudget?.toLocaleString() || 0}`}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Across all trips</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Saved Places</CardTitle>
            <Heart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {loading ? "..." : stats?.savedPlaces || 0}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">In your wishlist</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity</span>
            <Badge variant="outline">{activities.length} activities</Badge>
          </CardTitle>
          <CardDescription>Your latest travel planning activities</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/activity">View All Activity</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet</p>
              <p className="text-sm">Start planning your first trip to see activity here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
