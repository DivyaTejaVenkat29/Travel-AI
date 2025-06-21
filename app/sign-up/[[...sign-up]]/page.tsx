import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Join Travel Explorer</h1>
          <p className="text-muted-foreground">Start planning your perfect trips with AI assistance</p>
        </div>
        <SignUp
          forceRedirectUrl="/dashboard"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border-0",
            },
          }}
        />
      </div>
    </div>
  )
}
