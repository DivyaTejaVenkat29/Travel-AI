import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, DollarSign, Shield, Cpu } from "lucide-react"

export function GroqInfo() {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-green-600" />
          <span>Why Groq?</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Lightning Fast
          </Badge>
        </CardTitle>
        <CardDescription>
          Groq provides ultra-fast AI inference with excellent performance for travel planning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Ultra-Fast Responses</h4>
              <p className="text-xs text-muted-foreground">Get travel suggestions in milliseconds, not seconds</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Cost Effective</h4>
              <p className="text-xs text-muted-foreground">More affordable than traditional AI providers</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Cpu className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">High Performance</h4>
              <p className="text-xs text-muted-foreground">Optimized for real-time conversational AI</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Reliable</h4>
              <p className="text-xs text-muted-foreground">Enterprise-grade infrastructure and uptime</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
