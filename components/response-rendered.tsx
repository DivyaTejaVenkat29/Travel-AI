"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, IndianRupee, Car, Utensils, Navigation2 } from "lucide-react"

interface TravelResponseProps {
  content: string
}

export function TravelResponse({ content }: TravelResponseProps) {
  // Parse markdown-like content into structured data
  const parseContent = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    const sections: Array<{
      title: string
      items: Array<{
        name: string
        description: string
        details: string[]
      }>
    }> = []

    let currentSection: (typeof sections)[0] | null = null
    let currentItem: (typeof sections)[0]["items"][0] | null = null

    for (const line of lines) {
      const trimmedLine = line.trim()

      // Section headers (## Title)
      if (trimmedLine.startsWith("## ")) {
        if (currentItem && currentSection) {
          currentSection.items.push(currentItem)
          currentItem = null
        }
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          title: trimmedLine.replace("## ", "").trim(),
          items: [],
        }
      }
      // Item headers (- **Name** - Description)
      else if (trimmedLine.match(/^-\s*\*\*(.*?)\*\*\s*-\s*(.*)$/)) {
        if (currentItem && currentSection) {
          currentSection.items.push(currentItem)
        }
        const match = trimmedLine.match(/^-\s*\*\*(.*?)\*\*\s*-\s*(.*)$/)
        if (match && currentSection) {
          currentItem = {
            name: match[1].trim(),
            description: match[2].trim(),
            details: [],
          }
        }
      }
      // Detail lines (  - Detail)
      else if (trimmedLine.match(/^\s*-\s+(.+)$/)) {
        const match = trimmedLine.match(/^\s*-\s+(.+)$/)
        if (match && currentItem) {
          currentItem.details.push(match[1].trim())
        }
      }
      // Handle continuation lines or other content
      else if (trimmedLine && currentSection && !currentItem && !trimmedLine.startsWith("-")) {
        // This might be additional section content
      }
    }

    // Add the last item and section
    if (currentItem && currentSection) {
      currentSection.items.push(currentItem)
    }
    if (currentSection) {
      sections.push(currentSection)
    }

    return sections
  }

  const extractInfo = (text: string) => {
    const info = {
      price: null as string | null,
      distance: null as string | null,
      time: null as string | null,
      transport: null as string | null,
    }

    // Extract price (₹X or ₹X-₹Y)
    const priceMatch = text.match(/₹(\d+)(?:-₹(\d+))?/)
    if (priceMatch) {
      info.price = priceMatch[2] ? `₹${priceMatch[1]}-₹${priceMatch[2]}` : `₹${priceMatch[1]}`
    }

    // Extract distance
    const distanceMatch = text.match(/(\d+)\s*km/)
    if (distanceMatch) {
      info.distance = `${distanceMatch[1]} km`
    }

    // Extract time
    const timeMatch = text.match(/(\d+(?:-\d+)?)\s*minutes?/)
    if (timeMatch) {
      info.time = `${timeMatch[1]} min`
    }

    // Check for transport mentions
    if (text.toLowerCase().includes("taxi") || text.toLowerCase().includes("car")) {
      info.transport = "Taxi/Car"
    } else if (text.toLowerCase().includes("auto") || text.toLowerCase().includes("rickshaw")) {
      info.transport = "Auto-rickshaw"
    } else if (text.toLowerCase().includes("bus") || text.toLowerCase().includes("metro")) {
      info.transport = "Public Transport"
    }

    return info
  }

  const sections = parseContent(content)

  // Fallback to simple display if parsing fails
  if (sections.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {content.replace(/\*\*(.*?)\*\*/g, "$1").replace(/##\s*/g, "")}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <div className="flex items-center space-x-2 border-b-2 border-blue-200 pb-2">
            {section.title.toLowerCase().includes("attractions") && <MapPin className="h-6 w-6 text-blue-600" />}
            {section.title.toLowerCase().includes("directions") && <Navigation2 className="h-6 w-6 text-green-600" />}
            {section.title.toLowerCase().includes("cuisine") && <Utensils className="h-6 w-6 text-orange-600" />}
            <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
          </div>

          <div className="grid gap-4">
            {section.items.map((item, itemIndex) => {
              // Combine all details to extract comprehensive info
              const allDetails = item.details.join(" ")
              const info = extractInfo(allDetails)

              return (
                <Card key={itemIndex} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>

                      {/* Quick Info Badges */}
                      <div className="flex flex-wrap gap-2">
                        {info.distance && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {info.distance}
                          </Badge>
                        )}
                        {info.time && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {info.time}
                          </Badge>
                        )}
                        {info.price && (
                          <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                            <IndianRupee className="h-3 w-3" />
                            {info.price}
                          </Badge>
                        )}
                        {info.transport && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            {info.transport}
                          </Badge>
                        )}
                      </div>

                      {/* Detailed Information */}
                      <div className="space-y-2">
                        {item.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-500 font-bold mt-1">•</span>
                            <span className="text-gray-700 leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
