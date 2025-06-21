"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Search, MapPin, Calendar, Heart, Share2, Download, MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UploadMemoryDialog } from "@/components/upload-memory-dialog"

interface Memory {
  id: string
  title: string
  location: string
  date: string
  images: string[]
  description: string
  tags: string[]
  trip?: string
  likes: number
  isLiked: boolean
}

export default function MemoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMemories = async () => {
    try {
      const response = await fetch("/api/memories")
      const data = await response.json()
      setMemories(data.memories || [])
    } catch (error) {
      console.error("Error fetching memories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      selectedFilter === "all" || (selectedFilter === "liked" && memory.isLiked) || memory.tags.includes(selectedFilter)

    return matchesSearch && matchesFilter
  })

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
            <Camera className="h-8 w-8 text-purple-600" />
            <span>Travel Memories</span>
          </h1>
          <p className="text-muted-foreground mt-2">Capture and relive your amazing travel experiences</p>
        </div>
        <UploadMemoryDialog onMemoryCreated={fetchMemories} />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search memories by title, location, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
                <TabsTrigger value="adventure">Adventure</TabsTrigger>
                <TabsTrigger value="nature">Nature</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Memories</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{memories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Liked</p>
                <p className="text-2xl font-bold text-pink-800 dark:text-pink-200">
                  {memories.filter((m) => m.isLiked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Countries</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {new Set(memories.map((m) => m.location.split(",").pop()?.trim())).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">This Year</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {memories.filter((m) => new Date(m.date).getFullYear() === 2024).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((memory) => (
          <Card key={memory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <img
                src={memory.images[0] || "/placeholder.svg"}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Heart className={`h-4 w-4 ${memory.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
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
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {memory.trip && (
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    {memory.trip}
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{memory.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>{memory.location}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{new Date(memory.date).toLocaleDateString()}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{memory.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {memory.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {memory.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{memory.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  <span>{memory.likes} likes</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No memories found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start uploading your travel photos to create memories"}
            </p>
            {!searchQuery && <UploadMemoryDialog onMemoryCreated={fetchMemories} />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
