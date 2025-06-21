import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const savedPlaces = await db.getUserSavedPlaces(userId)
    return NextResponse.json({ savedPlaces })
  } catch (error) {
    console.error("Error fetching saved places:", error)
    return NextResponse.json({ error: "Failed to fetch saved places" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const placeData = await request.json()
    const place = await db.savePlace(userId, placeData)

    return NextResponse.json({ place }, { status: 201 })
  } catch (error) {
    console.error("Error saving place:", error)
    return NextResponse.json({ error: "Failed to save place" }, { status: 500 })
  }
}
