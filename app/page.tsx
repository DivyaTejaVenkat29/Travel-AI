import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { LandingPage } from "@/components/landing-page"

export default async function HomePage() {
  const user = await currentUser()

  // If user is already signed in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return <LandingPage />
}
