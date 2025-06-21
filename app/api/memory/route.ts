import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock memories data
const getUserMemories = (userId: string) => [
  {
    id: "1",
    userId,
    title: "Sunset at Santorini",
    location: "Santorini, Greece",
    date: "2024-08-15",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "Amazing sunset view from Oia village. The colors were absolutely breathtaking!",
    tags: ["sunset", "greece", "romantic", "photography"],
    trip: "Greek Islands Adventure",
    likes: 24,
    isLiked: true,
    createdAt: new Date("2024-08-15"),
  },
  {
    id: "2",
    userId,
    title: "Tokyo Street Food",
    location: "Shibuya, Tokyo",
    date: "2024-07-22",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "Incredible ramen and street food experience in the heart of Tokyo.",
    tags: ["food", "japan", "street-food", "culture"],
    trip: "Japan Discovery",
    likes: 18,
    isLiked: false,
    createdAt: new Date("2024-07-22"),
  },
]

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memories = getUserMemories(userId)
    return NextResponse.json({ memories })
  } catch (error) {
    console.error("Error fetching memories:", error)
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const tags = JSON.parse((formData.get("tags") as string) || "[]")
    const files = formData.getAll("images") as File[]

    // Validate required fields
    if (!title || !location) {
      return NextResponse.json({ error: "Title and location are required" }, { status: 400 })
    }

    // In production, upload files to cloud storage
    const imageUrls = files.map((file, index) => `/placeholder.svg?height=300&width=400&t=${Date.now()}&i=${index}`)

    const memory = {
      id: `memory_${Date.now()}`,
      userId,
      title,
      location,
      date: new Date().toISOString().split("T")[0],
      images: imageUrls,
      description: description || "",
      tags,
      trip: null,
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    }

    console.log("Memory created:", memory)

    return NextResponse.json({ memory }, { status: 201 })
  } catch (error) {
    console.error("Error creating memory:", error)
    return NextResponse.json({ error: "Failed to create memory" }, { status: 500 })
  }
}
