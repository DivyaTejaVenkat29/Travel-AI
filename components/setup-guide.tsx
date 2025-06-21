import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Key, Database, MessageCircle, CheckCircle } from "lucide-react"
import { GroqInfo } from "./groq-info"

export default function SetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TravelAI Setup</h1>
          <p className="text-gray-600">Let's get your travel planning application configured and ready to use.</p>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          {/* Step 1: Clerk Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <span>Step 1: Set up Clerk Authentication</span>
              </CardTitle>
              <CardDescription>Configure authentication with Google sign-in and email/password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Required Environment Variables:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="bg-white p-2 rounded border">
                    <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code>CLERK_SECRET_KEY=sk_test_...</code>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code>NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in</code>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code>NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up</code>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button asChild>
                  <a
                    href="https://dashboard.clerk.com/last-active?path=api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Get Clerk API Keys</span>
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://clerk.com/docs/quickstarts/nextjs" target="_blank" rel="noopener noreferrer">
                    View Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Groq Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span>Step 2: Configure AI Chatbot (Groq)</span>
              </CardTitle>
              <CardDescription>Set up Groq API for lightning-fast intelligent travel suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GroqInfo />

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Required Environment Variable:</h4>
                <div className="bg-white p-2 rounded border font-mono text-sm">
                  <code>GROQ_API_KEY=gsk_...</code>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button asChild>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Get Groq API Key</span>
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://groq.com/" target="_blank" rel="noopener noreferrer">
                    Learn About Groq
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span>Step 3: Set up Vercel PostgreSQL</span>
              </CardTitle>
              <CardDescription>Configure your database for storing user data and travel information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Required Environment Variable:</h4>
                <div className="bg-white p-2 rounded border font-mono text-sm">
                  <code>DATABASE_URL=postgres://...</code>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  After setting up your database, run the initialization scripts to create the required tables.
                </AlertDescription>
              </Alert>

              <Button asChild>
                <a
                  href="https://vercel.com/docs/storage/vercel-postgres"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Vercel PostgreSQL Docs</span>
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Instructions</CardTitle>
              <CardDescription>Follow these steps to get your application running</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root
                </li>
                <li>Add all the environment variables listed above</li>
                <li>
                  Install dependencies with <code className="bg-gray-100 px-2 py-1 rounded">npm install</code>
                </li>
                <li>
                  Restart your development server with{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
                </li>
                <li>Configure Google OAuth in your Clerk dashboard (optional)</li>
                <li>Run the database initialization scripts</li>
                <li>Start using your travel planning application!</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
