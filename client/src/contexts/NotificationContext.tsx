"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import socketService from '@/services/socketService'

interface UnreadCounts {
  [communityId: number]: number
}

interface NotificationContextType {
  unreadCounts: UnreadCounts
  incrementUnreadCount: (communityId: number, increment?: number) => void
  markAsRead: (communityId: number) => void
  setUnreadCount: (communityId: number, count: number) => void
  getTotalUnreadCount: () => number
  activeCommunityId: number | null
  setActiveCommunityId: (id: number | null) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({})
  const [activeCommunityId, setActiveCommunityId] = useState<number | null>(null)

  const incrementUnreadCount = useCallback((communityId: number, increment: number = 1) => {
    setUnreadCounts(prev => ({
      ...prev,
      [communityId]: (prev[communityId] || 0) + increment
    }))
  }, [])

  const markAsRead = useCallback((communityId: number) => {
    setUnreadCounts(prev => ({
      ...prev,
      [communityId]: 0
    }))
  }, [])

  const setUnreadCount = useCallback((communityId: number, count: number) => {
    setUnreadCounts(prev => ({
      ...prev,
      [communityId]: Math.max(0, count)
    }))
  }, [])

  const getTotalUnreadCount = useCallback(() => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0)
  }, [unreadCounts])

  // Global socket connection and listener
  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem("accessToken")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        const userId = user?.id

        if (userId) {
          // Connect to socket globally
          socketService.connect(userId, token)

          // Global listener for new messages to update unread counts
          const handleNewMessage = (message: any) => {
            const messageCommunityId = message.community_id

            // We check if we should increment. 
            // The community-list and chat-area components will handle marking as read.
            // Here we just ensure the count goes up.
            if (messageCommunityId) {
              const communityIdNum = typeof messageCommunityId === 'string'
                ? parseInt(messageCommunityId, 10)
                : messageCommunityId;

              if (!isNaN(communityIdNum)) {
                // Determine if we should increment
                // Skip if this is the currently active community
                if (communityIdNum !== activeCommunityId) {
                  incrementUnreadCount(communityIdNum, 1)
                }
              }
            }
          }

          socketService.onNewMessage(handleNewMessage)

          return () => {
            socketService.offNewMessage(handleNewMessage)
          }
        }
      } catch (err) {
        console.error("Error initializing global socket connection:", err)
      }
    }
  }, [incrementUnreadCount, activeCommunityId])

  return (
    <NotificationContext.Provider value={{
      unreadCounts,
      incrementUnreadCount,
      markAsRead,
      setUnreadCount,
      getTotalUnreadCount,
      activeCommunityId,
      setActiveCommunityId
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
