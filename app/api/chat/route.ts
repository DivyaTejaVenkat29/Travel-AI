import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { auth } from "@clerk/nextjs/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Function to get region-specific currency and formatting
function getRegionInfo(country: string) {
  const regionMap: Record<string, { currency: string; symbol: string; locale: string }> = {
    India: { currency: "INR", symbol: "₹", locale: "en-IN" },
    "United States": { currency: "USD", symbol: "$", locale: "en-US" },
    "United Kingdom": { currency: "GBP", symbol: "£", locale: "en-GB" },
    Canada: { currency: "CAD", symbol: "C$", locale: "en-CA" },
    Australia: { currency: "AUD", symbol: "A$", locale: "en-AU" },
    Germany: { currency: "EUR", symbol: "€", locale: "de-DE" },
    France: { currency: "EUR", symbol: "€", locale: "fr-FR" },
    Japan: { currency: "JPY", symbol: "¥", locale: "ja-JP" },
    China: { currency: "CNY", symbol: "¥", locale: "zh-CN" },
    Brazil: { currency: "BRL", symbol: "R$", locale: "pt-BR" },
    Mexico: { currency: "MXN", symbol: "$", locale: "es-MX" },
    Singapore: { currency: "SGD", symbol: "S$", locale: "en-SG" },
    "South Korea": { currency: "KRW", symbol: "₩", locale: "ko-KR" },
    Thailand: { currency: "THB", symbol: "฿", locale: "th-TH" },
    Malaysia: { currency: "MYR", symbol: "RM", locale: "ms-MY" },
    Indonesia: { currency: "IDR", symbol: "Rp", locale: "id-ID" },
    Philippines: { currency: "PHP", symbol: "₱", locale: "en-PH" },
    "South Africa": { currency: "ZAR", symbol: "R", locale: "en-ZA" },
    Nigeria: { currency: "NGN", symbol: "₦", locale: "en-NG" },
    Egypt: { currency: "EGP", symbol: "E£", locale: "ar-EG" },
    "United Arab Emirates": { currency: "AED", symbol: "د.إ", locale: "ar-AE" },
    "Saudi Arabia": { currency: "SAR", symbol: "﷼", locale: "ar-SA" },
    Turkey: { currency: "TRY", symbol: "₺", locale: "tr-TR" },
    Russia: { currency: "RUB", symbol: "₽", locale: "ru-RU" },
  }

  return regionMap[country] || { currency: "USD", symbol: "$", locale: "en-US" }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { messages, location, preferences } = await req.json()

    const hasLocation = location?.hasLocation && location?.city && location?.country
    const locationInfo = hasLocation
      ? `${location.city}, ${location.country} (Coordinates: ${location.latitude}, ${location.longitude})`
      : "not available"

    const regionInfo = hasLocation ? getRegionInfo(location.country) : { currency: "USD", symbol: "$", locale: "en-US" }

    const system = `
You are a helpful travel assistant AI specializing in region-specific travel advice.

USER LOCATION: ${locationInfo}
REGION INFO: Currency: ${regionInfo.currency} (${regionInfo.symbol}), Locale: ${regionInfo.locale}

FORMATTING RULES:
- ALWAYS use ${regionInfo.symbol} for all price mentions (e.g., ${regionInfo.symbol}1000, ${regionInfo.symbol}50-200)
- Use clean, readable text without special characters like *, #, or excessive formatting
- Write in clear, simple sentences
- Use bullet points with simple dashes (-) instead of special characters
- Format prices in local currency: ${regionInfo.symbol}amount (e.g., ${regionInfo.symbol}1000 for one thousand)
- Use region-appropriate distance units (km for most countries, miles for US/UK)
- Consider local transportation options and costs in ${regionInfo.currency}

${
  hasLocation
    ? `
LOCATION-BASED CAPABILITIES:
- Calculate distances from ${location.city}, ${location.country}
- Suggest destinations within specific distance ranges
- Recommend local transportation options and costs in ${regionInfo.currency}
- Provide region-specific travel advice
- Consider local departure points (airports, train stations, bus terminals)
- Factor in local travel costs, accommodation prices, and food expenses in ${regionInfo.currency}
`
    : `
GENERAL CAPABILITIES:
- Provide travel recommendations based on preferences
- Suggest destinations worldwide with appropriate currency conversions
- Help with budget planning and itinerary creation
- Offer travel tips and advice
`
}

USER PREFERENCES:
- Style: ${preferences?.style || "unspecified"}
- Budget: ${preferences?.budgetLabel || "unspecified"}
- Duration: ${preferences?.duration || "unspecified"}

INSTRUCTIONS:
${
  hasLocation
    ? `
- Always provide costs in ${regionInfo.currency} (${regionInfo.symbol})
- Consider local travel patterns and popular destinations from ${location.city}
- Mention approximate distances and travel times from their location
- Suggest appropriate transportation methods available in ${location.country}
- Factor in local cost of living for accommodation and food recommendations
- Consider seasonal factors and local holidays for ${location.country}
`
    : `
- Ask clarifying questions about their location and currency preferences
- Provide general travel advice with currency conversions when possible
- Help them plan trips based on their stated preferences and budget
`
}

RESPONSE FORMAT:
- Use clean, simple text without special formatting characters
- Present information in clear sections
- Use simple bullet points with dashes (-)
- Always specify currency symbol before amounts
- Keep sentences concise and readable
- Avoid using *, #, or other special characters for emphasis
`

    const result = streamText({
      model: groq("gemma2-9b-it"),
      system,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error("Chat API error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
