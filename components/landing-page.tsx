"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Heart, MessageCircle, Users, Star, ArrowRight, Plane, Globe, Compass } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: MessageCircle,
      title: "AI Travel Assistant",
      description:
        "Get personalized recommendations and instant answers to all your travel questions with our intelligent AI companion.",
    },
    {
      icon: MapPin,
      title: "Smart Trip Planning",
      description: "Create detailed itineraries with budget tracking, activity suggestions, and real-time updates.",
    },
    {
      icon: Camera,
      title: "Memory Keeper",
      description: "Capture and organize your travel memories with photos, notes, and location tags.",
    },
    {
      icon: Heart,
      title: "Save & Discover",
      description: "Build your travel wishlist and discover hidden gems recommended by fellow travelers.",
    },
  ]

  const stats = [
    { icon: Users, value: "10K+", label: "Happy Travelers" },
    { icon: Globe, value: "150+", label: "Countries Covered" },
    { icon: Star, value: "4.9", label: "User Rating" },
    { icon: Plane, value: "50K+", label: "Trips Planned" },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Nomad",
      content:
        "This app transformed how I plan my travels. The AI suggestions are spot-on and saved me hours of research!",
      avatar: "SC",
    },
    {
      name: "Mike Rodriguez",
      role: "Adventure Seeker",
      content: "Love how I can keep all my travel memories in one place. The photo organization feature is incredible.",
      avatar: "MR",
    },
    {
      name: "Emma Thompson",
      role: "Family Traveler",
      content: "Planning family trips has never been easier. The budget tracking helps us stay on track every time.",
      avatar: "ET",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Travel Explorer</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Reviews
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 AI-Powered Travel Planning
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Perfect Trip Starts with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing destinations, plan detailed itineraries, and create unforgettable memories with our
            intelligent travel companion. Your next adventure is just a conversation away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Planning Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-20 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Perfect Trips</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered recommendations to memory keeping, we've got every aspect of your travel covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/50 py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and plan your perfect trip with AI assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Tell Us Your Dreams</h3>
              <p className="text-muted-foreground">
                Share your travel preferences, budget, and interests with our AI assistant.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Smart Recommendations</h3>
              <p className="text-muted-foreground">
                Receive personalized suggestions for destinations, activities, and accommodations.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan & Explore</h3>
              <p className="text-muted-foreground">
                Create detailed itineraries, track budgets, and capture memories along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container px-4 py-20 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Travelers Worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our community of adventurers has to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Next Adventure?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers who trust us to make their trips unforgettable. Start planning your perfect
              getaway today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Travel Explorer</span>
              </div>
              <p className="text-muted-foreground">Your AI-powered travel companion for unforgettable adventures.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-primary">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="hover:text-primary">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Travel Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
