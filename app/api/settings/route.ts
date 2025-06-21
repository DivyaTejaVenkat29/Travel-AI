import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock settings data - replace with your database
const mockSettings = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate traveler exploring the world one destination at a time.",
    location: "New York, USA",
    website: "https://johndoe.travel",
    avatar: "/placeholder.svg?height=96&width=96",
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: true,
    tripUpdates: true,
    priceAlerts: true,
    recommendations: true,
  },
  preferences: {
    currency: "USD",
    language: "en",
    timezone: "America/New_York",
    units: "metric",
    travelStyle: "adventure",
    budgetRange: "mid-range",
  },
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, fetch from database based on userId
    return NextResponse.json({ settings: mockSettings })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    // In a real app, update database based on userId
    const updatedSettings = { ...mockSettings, ...updates }

    return NextResponse.json({ settings: updatedSettings })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
