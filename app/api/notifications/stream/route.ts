import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`)

      // Simulate real-time notifications
      const interval = setInterval(() => {
        const notification = {
          id: Date.now().toString(),
          type: "system",
          title: "Real-time Update",
          message: "This is a real-time notification!",
          time: "Just now",
          read: false,
          priority: "low",
          createdAt: new Date(),
        }

        controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`)
      }, 30000) // Send every 30 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
