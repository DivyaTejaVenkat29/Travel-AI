import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock data - replace with your database
const mockNotifications = [
  {
    id: "1",
    type: "trip",
    title: "Flight Confirmation",
    message: "Your flight to Tokyo has been confirmed. Check-in opens 24 hours before departure.",
    time: "2 hours ago",
    read: false,
    priority: "high",
    actionUrl: "/dashboard/trips/tokyo-2024",
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "price",
    title: "Price Drop Alert",
    message: "Hotel prices in Kyoto dropped by 25%. Book now to save $150 on your stay.",
    time: "4 hours ago",
    read: false,
    priority: "medium",
    actionUrl: "/dashboard/deals/kyoto-hotels",
    createdAt: new Date(),
  },
  // Add more mock notifications...
]

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, fetch from database based on userId
    return NextResponse.json({ notifications: mockNotifications })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
