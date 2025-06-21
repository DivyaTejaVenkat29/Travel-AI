import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trip = await db.getTripById(params.id)
    if (!trip || trip.userId !== userId) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    const trip = await db.updateTrip(params.id, updates)

    if (!trip || trip.userId !== userId) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trip = await db.getTripById(params.id)
    if (!trip || trip.userId !== userId) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    await db.deleteTrip(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 })
  }
}
