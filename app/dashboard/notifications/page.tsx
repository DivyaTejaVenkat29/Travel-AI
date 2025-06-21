"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bell,
  Plane,
  MapPin,
  CreditCard,
  Star,
  Clock,
  Check,
  X,
  Archive,
  Filter,
  MoreHorizontal,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"

export default function NotificationsPage() {
  const { notifications, loading, error, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications()

  const [filter, setFilter] = useState<"all" | "unread" | "trip" | "price" | "recommendation">("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(id)
    await markAsRead(id)
    setActionLoading(null)
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    await deleteNotification(id)
    setActionLoading(null)
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === "high" ? "text-red-500" : priority === "medium" ? "text-yellow-500" : "text-blue-500"

    switch (type) {
      case "trip":
        return <Plane className={`h-4 w-4 ${iconClass}`} />
      case "price":
        return <CreditCard className={`h-4 w-4 ${iconClass}`} />
      case "recommendation":
        return <MapPin className={`h-4 w-4 ${iconClass}`} />
      case "social":
        return <Star className={`h-4 w-4 ${iconClass}`} />
      case "system":
        return <AlertCircle className={`h-4 w-4 ${iconClass}`} />
      default:
        return <Bell className={`h-4 w-4 ${iconClass}`} />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error loading notifications</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Bell className="h-8 w-8" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">Stay updated with your travel activities and recommendations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Notifications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("unread")}>Unread Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("trip")}>Trip Updates</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("price")}>Price Alerts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("recommendation")}>Recommendations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Unread</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Trip Updates</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {notifications.filter((n) => n.type === "trip").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Price Alerts</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {notifications.filter((n) => n.type === "price").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Notifications</span>
            <Badge variant="outline">{filteredNotifications.length} notifications</Badge>
          </CardTitle>
          <CardDescription>
            {filter === "all"
              ? "All your notifications"
              : filter === "unread"
                ? "Unread notifications only"
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} notifications`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-muted/30 transition-colors ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                            {getPriorityBadge(notification.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{notification.time}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={notification.actionUrl}>View</a>
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={actionLoading === notification.id}>
                                {actionLoading === notification.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(notification.id)}
                                className="text-destructive"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
