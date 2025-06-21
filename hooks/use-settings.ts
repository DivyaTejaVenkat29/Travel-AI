"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  avatar?: string
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  tripUpdates: boolean
  priceAlerts: boolean
  recommendations: boolean
}

export interface TravelPreferences {
  currency: string
  language: string
  timezone: string
  units: string
  travelStyle: string
  budgetRange: string
}

export interface UserSettings {
  profile: UserProfile
  notifications: NotificationSettings
  preferences: TravelPreferences
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get("/settings")
      setSettings(data.settings)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings")
      console.error("Error fetching settings:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save settings to API
  const saveSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      try {
        setSaving(true)
        const updatedSettings = await api.put("/settings", newSettings)
        setSettings(updatedSettings.settings)

        toast({
          title: "Settings saved",
          description: "Your settings have been updated successfully.",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to save settings"
        setError(errorMessage)
        toast({
          title: "Error saving settings",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
    },
    [toast],
  )

  // Update specific setting section
  const updateProfile = useCallback(
    async (profile: Partial<UserProfile>) => {
      if (!settings) return
      const newSettings = { ...settings, profile: { ...settings.profile, ...profile } }
      await saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  const updateNotifications = useCallback(
    async (notifications: Partial<NotificationSettings>) => {
      if (!settings) return
      const newSettings = { ...settings, notifications: { ...settings.notifications, ...notifications } }
      await saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  const updatePreferences = useCallback(
    async (preferences: Partial<TravelPreferences>) => {
      if (!settings) return
      const newSettings = { ...settings, preferences: { ...settings.preferences, ...preferences } }
      await saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  // Upload avatar
  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        setSaving(true)
        const formData = new FormData()
        formData.append("avatar", file)

        const response = await fetch("/api/settings/avatar", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Failed to upload avatar")

        const data = await response.json()

        if (settings) {
          setSettings({
            ...settings,
            profile: { ...settings.profile, avatar: data.avatarUrl },
          })
        }

        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to upload avatar"
        toast({
          title: "Error uploading avatar",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
    },
    [settings, toast],
  )

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    saving,
    error,
    updateProfile,
    updateNotifications,
    updatePreferences,
    uploadAvatar,
    refetch: fetchSettings,
  }
}
