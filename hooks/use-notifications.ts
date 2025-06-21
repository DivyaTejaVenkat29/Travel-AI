"use client"

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

export interface Notification {
  id: string
  type: 'trip' | 'price' | 'recommendation' | 'system' | 'social'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  createdAt: Date
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.get('/notifications')
      setNotifications(data.notifications || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`, { read: true })
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/notifications/mark-all-read', {})
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [])

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }, [])

  // Setup real-time updates with Server-Sent Events
  useEffect(() => {
    fetchNotifications()

    // Setup SSE for real-time notifications
    const eventSource = new EventSource('/api/notifications/stream')
    
    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data)
        addNotification(notification)
      } catch (err) {
        console.error('Error parsing SSE data:', err)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
    }

    return () => {
      eventSource.close()
    }
  }, [fetchNotifications, addNotification])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  }
}
