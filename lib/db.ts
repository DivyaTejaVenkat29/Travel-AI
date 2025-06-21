// Database schema and utilities
export interface User {
  id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Trip {
  id: string
  userId: string
  title: string
  destination: string
  description?: string
  startDate: Date
  endDate: Date
  travelers: number
  budget: string
  travelStyle: string
  interests: string[]
  status: 'planning' | 'booked' | 'completed' | 'cancelled'
  totalCost?: number
  currency: string
  itinerary?: TripDay[]
  createdAt: Date
  updatedAt: Date
}

export interface TripDay {
  id: string
  tripId: string
  day: number
  date: Date
  activities: Activity[]
  accommodation?: {
    name: string
    address: string
    cost: number
    checkIn: string
    checkOut: string
  }
  transportation?: {
    type: string
    from: string
    to: string
    cost: number
    time: string
  }
  totalDayCost: number
}

export interface Activity {
  id: string
  name: string
  type: 'attraction' | 'restaurant' | 'activity' | 'shopping' | 'transport'
  description?: string
  location: string
  cost: number
  duration: string
  time: string
  rating?: number
  notes?: string
}

export interface Conversation {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  context?: {
    location?: {
      latitude: number
      longitude: number
      city: string
      country: string
    }
    preferences?: {
      style: string
      budgetLabel: string
      duration: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    location?: any
    suggestions?: any
  }
}

export interface SavedPlace {
  id: string
  userId: string
  name: string
  type: string
  location: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  description?: string
  rating?: number
  cost?: string
  images?: string[]
  notes?: string
  tags: string[]
  visitStatus: 'wishlist' | 'visited' | 'planning'
  createdAt: Date
  updatedAt: Date
}

export interface UserActivity {
  id: string
  userId: string
  type: 'trip_created' | 'trip_updated' | 'place_saved' | 'chat_started' | 'itinerary_generated'
  title: string
  description: string
  metadata?: any
  relatedId?: string // ID of related trip, conversation, etc.
  createdAt: Date
}

// Mock database functions (replace with real database in production)
class MockDatabase {
  private trips: Trip[] = []
  private conversations: Conversation[] = []
  private savedPlaces: SavedPlace[] = []
  private activities: UserActivity[] = []

  // Trip methods
  async createTrip(userId: string, tripData: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    const trip: Trip = {
      id: `trip_${Date.now()}`,
      userId,
      ...tripData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.trips.push(trip)
    
    // Add activity
    await this.addActivity(userId, {
      type: 'trip_created',
      title: 'New Trip Created',
      description: `Created trip to ${tripData.destination}`,
      relatedId: trip.id,
    })
    
    return trip
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    return this.trips.filter(trip => trip.userId === userId)
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    return this.trips.find(trip => trip.id === tripId) || null
  }

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip | null> {
    const index = this.trips.findIndex(trip => trip.id === tripId)
    if (index === -1) return null
    
    this.trips[index] = { ...this.trips[index], ...updates, updatedAt: new Date() }
    return this.trips[index]
  }

  async deleteTrip(tripId: string): Promise<boolean> {
    const index = this.trips.findIndex(trip => trip.id === tripId)
    if (index === -1) return false
    
    this.trips.splice(index, 1)
    return true
  }

  // Conversation methods
  async createConversation(userId: string, title: string, context?: any): Promise<Conversation> {
    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      userId,
      title,
      messages: [],
      context,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.conversations.push(conversation)
    
    await this.addActivity(userId, {
      type: 'chat_started',
      title: 'Started AI Chat',
      description: title,
      relatedId: conversation.id,
    })
    
    return conversation
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversations.filter(conv => conv.userId === userId)
  }

  async addMessageToConversation(conversationId: string, message: Omit<ChatMessage, 'id' | 'conversationId' | 'timestamp'>): Promise<ChatMessage> {
    const conversation = this.conversations.find(conv => conv.id === conversationId)
    if (!conversation) throw new Error('Conversation not found')
    
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      ...message,
      timestamp: new Date(),
    }
    
    conversation.messages.push(chatMessage)
    conversation.updatedAt = new Date()
    
    return chatMessage
  }

  // Saved places methods
  async savePlace(userId: string, placeData: Omit<SavedPlace, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SavedPlace> {
    const place: SavedPlace = {
      id: `place_${Date.now()}`,
      userId,
      ...placeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.savedPlaces.push(place)
    
    await this.addActivity(userId, {
      type: 'place_saved',
      title: 'Saved Place',
      description: `Added ${placeData.name} to ${placeData.visitStatus}`,
      relatedId: place.id,
    })
    
    return place
  }

  async getUserSavedPlaces(userId: string): Promise<SavedPlace[]> {
    return this.savedPlaces.filter(place => place.userId === userId)
  }

  async updateSavedPlace(placeId: string, updates: Partial<SavedPlace>): Promise<SavedPlace | null> {
    const index = this.savedPlaces.findIndex(place => place.id === placeId)
    if (index === -1) return null
    
    this.savedPlaces[index] = { ...this.savedPlaces[index], ...updates, updatedAt: new Date() }
    return this.savedPlaces[index]
  }

  // Activity methods
  async addActivity(userId: string, activityData: Omit<UserActivity, 'id' | 'userId' | 'createdAt'>): Promise<UserActivity> {
    const activity: UserActivity = {
      id: `activity_${Date.now()}`,
      userId,
      ...activityData,
      createdAt: new Date(),
    }
    this.activities.push(activity)
    return activity
  }

  async getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
    return this.activities
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  // Stats methods
  async getUserStats(userId: string) {
    const trips = await this.getUserTrips(userId)
    const savedPlaces = await this.getUserSavedPlaces(userId)
    const conversations = await this.getUserConversations(userId)
    
    const completedTrips = trips.filter(trip => trip.status === 'completed')
    const countries = new Set(trips.map(trip => trip.destination.split(',').pop()?.trim())).size
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.totalCost || 0), 0)
    
    return {
      totalTrips: trips.length,
      completedTrips: completedTrips.length,
      countriesVisited: countries,
      totalBudget,
      savedPlaces: savedPlaces.length,
      conversations: conversations.length,
    }
  }
}

export const db = new MockDatabase()
