"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface UnreadCounts {
  [communityId: string]: number
}

interface NotificationContextType {
  unreadCounts: UnreadCounts
  incrementUnreadCount: (communityId: string, increment?: number) => void
  markAsRead: (communityId: string) => void
  setUnreadCount: (communityId: string, count: number) => void
  getTotalUnreadCount: () => number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({})

  const incrementUnreadCount = useCallback((communityId: string, increment: number = 1) => {
    setUnreadCounts(prev => ({
      ...prev,
      [communityId]: (prev[communityId] || 0) + increment
    }))
  }, [])

  const markAsRead = useCallback((communityId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [communityId]: 0
    }))
  }, [])

  const setUnreadCount = useCallback((communityId: string, count: number) => {
    setUnreadCounts(prev => ({
      ...prev,
      [communityId]: Math.max(0, count)
    }))
  }, [])

  const getTotalUnreadCount = useCallback(() => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0)
  }, [unreadCounts])

  return (
    <NotificationContext.Provider value={{
      unreadCounts,
      incrementUnreadCount,
      markAsRead,
      setUnreadCount,
      getTotalUnreadCount
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
