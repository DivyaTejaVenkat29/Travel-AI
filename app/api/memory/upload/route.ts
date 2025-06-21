import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
      }
    }

    // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
    const uploadedFiles = files.map((file, index) => ({
      id: `upload_${Date.now()}_${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/placeholder.svg?height=300&width=400&t=${Date.now()}&i=${index}`,
    }))

    console.log("Files uploaded:", uploadedFiles)

    return NextResponse.json({ files: uploadedFiles }, { status: 200 })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}
