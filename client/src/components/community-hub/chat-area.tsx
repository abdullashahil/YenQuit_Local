"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Users,
  Edit3,
  Trash2,
  Reply,
  Smile,
  Sparkles,
  X,
  Paperclip,
} from "lucide-react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import socketService, { OnlineUser } from "../../services/socketService"
import { useNotifications } from "../../contexts/NotificationContext"

// Config for API bases
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const YENAI_API_BASE = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL
  if (!env) return "http://localhost:5000/api"
  return env.endsWith("/api") ? env : `${env.replace(/\/$/, "")}/api`
})()

// Constants used by YenAI logic
const TEST_USER_ID = "d5799f0c-f707-415e-b9ea-68816351912c" // keep for testing

// Types
interface Community {
  id: string
  name: string
description?: string
  member_count: number
  online_count: number
  user_role?: string
}

interface ChatMessage {
  id: string
  community_id: string
  user_id: string
  content: string
  message_type: "text" | "image" | "file" | "system"
  file_url?: string
  reply_to?: string
  is_edited: boolean
  edited_at?: string
  created_at: string
  email: string
  role: string
  full_name?: string
  avatar_url?: string
  reply_content?: string
  reply_author_email?: string
  reply_author_name?: string
  reply_author_avatar?: string
}

interface YenaiMessage {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  isOwn: boolean
}

interface ChatAreaProps {
  community: Community | null
  onBack?: () => void
  onClose?: () => void
}

export default function ChatArea({ community, onBack, onClose }: ChatAreaProps) {
  // Determine YenAI mode
  const isYenAI = community?.id === "yenai-chat"
  const { incrementUnreadCount } = useNotifications()

  // Helper to get current user info
  const getCurrentUser = () => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  const currentUser = getCurrentUser()

  // YenAI state & refs (kept intact from your original AI code)
  const [yenaiMessages, setYenaiMessages] = useState<YenaiMessage[]>([])
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Socket-driven chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [typingUsers, setTypingUsers] = useState<{ id: string, name: string }[]>([])
  const [showOnlineUsers, setShowOnlineUsers] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Utility
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  const fetchYenaiHistory = useCallback(async () => {
    // If no user is logged in, we can't fetch personalized history
    // We could potentialy use a temporary ID or just show empty, 
    // but here we depend on currentUser.
    const userId = currentUser?.id || TEST_USER_ID

    setIsLoadingHistory(true)
    try {
      const response = await axios.get(`${YENAI_API_BASE}/yenquit-chat/history/${userId}`)
      if (response.data?.success && Array.isArray(response.data.history)) {
        const historyMessages: YenaiMessage[] = response.data.history.map((msg: any) => ({
          id: `${msg.role}-${msg.timestamp || Date.now()}`,
          author: msg.role === "user" ? "You" : "YenAI",
          avatar:
            msg.role === "user"
              ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333333' width='100' height='100'/%3E%3Ctext x='50' y='50' fontSize='60' fill='white' textAnchor='middle' dy='.3em'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E",
          content: msg.content,
          timestamp: msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Just now",
          isOwn: msg.role === "user",
        }))

        setYenaiMessages(historyMessages.length > 0 ? historyMessages : [
          {
            id: "1",
            author: "YenAI",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F5A623'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E",
            content: "Hello! I'm YenAI, your personal assistant. How can I help you today?",
            timestamp: "Now",
            isOwn: false,
          },
        ])
      } else {
        setYenaiMessages([
          {
            id: "1",
            author: "YenAI",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F5A623'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E",
            content: "Hello! I'm YenAI, your personal assistant. How can I help you today?",
            timestamp: "Now",
            isOwn: false,
          },
        ])
      }
    } catch (err) {
      console.error("Error fetching YenAI history:", err)
      setYenaiMessages([
        {
          id: "1",
          author: "YenAI",
          avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F5A623'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E",
          content: "Hello! I'm YenAI, your personal assistant. How can I help you today?",
          timestamp: "Now",
          isOwn: false,
        },
      ])
    } finally {
      setIsLoadingHistory(false)
    }
  }, [currentUser?.id]) // Depend on currentUser.id

  // YenAI: Send message to API
  const handleSendYenaiMessage = async (messageInputValue: string) => {
    const trimmed = messageInputValue.trim()
    if (!trimmed) return

    const userMessage: YenaiMessage = {
      id: `${Date.now()}-user`,
      author: "You",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    const updatedMessages = [...yenaiMessages, userMessage]
    setYenaiMessages(updatedMessages)
    setMessageInput("") // share input state with community side

    setError(null)
    setIsLoading(true)

    try {
      const maxHistoryMessages = 10
      const recentMessages = updatedMessages.slice(-maxHistoryMessages)
      const history = recentMessages.map((msg) => ({
        role: msg.isOwn ? "user" : "assistant",
        content: msg.content,
      }))

      // Use the actual user ID if available, otherwise fallback (or fail)
      const userId = currentUser?.id || TEST_USER_ID

      const response = await axios.post(`${YENAI_API_BASE}/yenquit-chat`, {
        message: trimmed,
        history,
        summary,
        userId: userId,
      })

      const replyText: string =
        response.data?.reply || response.data?.message || "Sorry, I could not generate a response."

      if (typeof response.data?.summary === "string" && response.data.summary.trim().length > 0) {
        setSummary(response.data.summary.trim())
      }

      const aiMessage: YenaiMessage = {
        id: `${Date.now()}-assistant`,
        author: "YenAI",
        avatar:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333333' width='100' height='100'/%3E%3Ctext x='50' y='50' fontSize='60' fill='white' textAnchor='middle' dy='.3em'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      }

      setYenaiMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Error sending message to YenAI:", err)
      setError("Unable to reach YenAI right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = useCallback(
    async () => {
      const c = community
      if (!c) return

      // Additional defensive check - don't fetch if user is not a member
      if (!isYenAI && !c.user_role) {
        console.log('DEBUG: Blocking message fetch for non-member')
        return
      }

      if (typeof window === 'undefined') return

      const token = localStorage.getItem("accessToken")
      if (!token) {
        setError("Please log in to view messages")
        return
      }

      setIsLoading(true)
      try {
        const res = await axios.get(`${API_BASE}/chat/${c.id}/messages/latest?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data?.success) {
          setMessages(res.data.data)
        } else {
          setMessages([])
        }
      } catch (err: any) {
        console.error("Error fetching messages:", err)
        if (err.response?.status === 403) {
          setError("You don't have permission to view this community's messages. Please join the community first.")
        } else {
          setError("Failed to load messages")
        }
      } finally {
        setIsLoading(false)
      }
    }, [community, isYenAI])

  // Socket initialization & handlers
  const initializeSocket = useCallback(
    (c?: Community) => {
      if (!c) return

      // Additional defensive check - don't initialize socket if user is not a member
      if (!isYenAI && !c.user_role) {
        console.log('DEBUG: Blocking socket initialization for non-member')
        return
      }

      if (typeof window === 'undefined') return

      const token = localStorage.getItem("accessToken")
      const userId = currentUser?.id

      if (!token || !userId) {
        console.error("Authentication token or user ID not found")
        setError("Please log in to join the chat")
        return
      }

      try {
        console.log('DEBUG: Initializing socket for community:', c.id)
        socketService.connect(userId, token)
        socketService.joinCommunity(c.id)
        console.log('DEBUG: Socket connected and joined community')

        // Only set up listeners once
        socketService.onNewMessage((message: ChatMessage) => {
          console.log('DEBUG: Received new message:', message)
          setMessages((prev) => [...prev, message])
          scrollToBottom()

          // Increment unread count if message is not from current user
          if (message.user_id !== currentUser?.id && community && !isYenAI) {
            incrementUnreadCount(community.id)
          }
        })

        socketService.onMessageEdited((message: ChatMessage) => {
          setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)))
        })

        socketService.onMessageDeleted(({ messageId }: { messageId: string }) => {
          setMessages((prev) => prev.filter((m) => m.id !== messageId))
        })

        socketService.onOnlineUsersUpdated((users: OnlineUser[]) => {
          setOnlineUsers(users)
        })

        socketService.onUserTyping(({ userId: typingUserId }: { userId: string }) => {
          if (typingUserId !== userId) {
            // Look up user from online users or messages to get the name
            const typingUser = onlineUsers.find(u => u.user_id === typingUserId) ||
              messages.find(m => m.user_id === typingUserId)
            const userName = typingUser?.full_name || typingUser?.email || 'Someone'

            setTypingUsers((prev) => {
              const exists = prev.find(u => u.id === typingUserId)
              if (!exists) {
                return [...prev, { id: typingUserId, name: userName }]
              }
              return prev
            })
          }
        })

        socketService.onUserStopTyping(({ userId: typingUserId }: { userId: string }) => {
          setTypingUsers((prev) => prev.filter((user) => user.id !== typingUserId))
        })

        return () => {
          console.log('DEBUG: Cleaning up socket connection')
          socketService.leaveCommunity(c.id)
          // Don't disconnect completely, just leave the community
          // socketService.disconnect()
        }
      } catch (err) {
        console.error("Failed to initialize socket:", err)
        setError("Failed to connect to chat")
      }
    },
    [currentUser?.id, isYenAI]
  )

  // Effects to load data depending on mode
  useEffect(() => {
    if (!community) return

    // Additional defensive check - don't run effects for non-members
    if (!isYenAI && !community.user_role) {
      console.log('DEBUG: Blocking useEffect for non-member')
      return
    }

    if (isYenAI) {
      fetchYenaiHistory()
      return
    }

    fetchMessages()

    // Initialize socket connection (only once per user)
    const cleanup = initializeSocket(community)

    return cleanup
  }, [community, isYenAI, fetchYenaiHistory, fetchMessages, initializeSocket])

  // Separate effect to handle community changes for socket
  useEffect(() => {
    if (!community || isYenAI) return

    // Only join/leave community when it changes, don't disconnect completely
    if (socketService.isConnected()) {
      const currentCommunity = socketService.getCurrentCommunity()
      if (currentCommunity !== community.id) {
        console.log('DEBUG: Switching from community', currentCommunity, 'to', community.id)
        if (currentCommunity) {
          socketService.leaveCommunity(currentCommunity)
        }
        socketService.joinCommunity(community.id)
      }
    }
  }, [community?.id, isYenAI])

  useEffect(() => {
    scrollToBottom()
  }, [messages, yenaiMessages, isLoading])

  // Socket Chat Actions
  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const isOwnMessage = (message: ChatMessage) => {
    return message.user_id === currentUser?.id
  }

  const handleSendSocketMessage = () => {
    const trimmed = messageInput.trim()
    if (!trimmed || !community) return

    setMessageInput("")
    setReplyingTo(null)
    setError(null)

    if (editingMessage) {
      console.log('DEBUG: Editing message:', editingMessage.id)
      socketService.editMessage(editingMessage.id, trimmed)
      setEditingMessage(null)
    } else {
      console.log('DEBUG: Sending message to community:', community.id)
      socketService.sendMessage(community!.id, trimmed, "text", undefined, replyingTo?.id)
    }
  }

  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessage(message)
    setMessageInput(message.content)
    setReplyingTo(null)
  }

  const handleDeleteMessage = (messageId: string) => {
    socketService.deleteMessage(messageId)
  }

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message)
    setEditingMessage(null)
  }

  const handleTyping = () => {
    if (!community) return
    socketService.startTyping(community.id)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(community.id)
    }, 1000)
  }

  const handleSubmit = () => {
    if (isYenAI) {
      handleSendYenaiMessage(messageInput)
      return
    }
    handleSendSocketMessage()
  }

  if (!community) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a community to start chatting</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated (except for YenAI)
  if (!isYenAI && !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Please log in to join the chat</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  // Check if user is a member (except for YenAI)
  if (!isYenAI && !community.user_role) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">You need to join this community to view messages</p>
          <p className="text-gray-400 text-sm mb-4">Go back to the community list and click "Join" to participate</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#20B2AA] text-white rounded-lg hover:bg-[#189a92]"
          >
            Back to Communities
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {isYenAI && <Sparkles className="w-5 h-5 text-[#2D9B8F]" />}
            <div>
              <h2 className="font-semibold text-gray-900">{community.name}</h2>
              <p className="text-xs text-gray-500">
                {community.member_count} members • {isYenAI ? 1 : onlineUsers.length} online
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isYenAI && (
            <button
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-gray-700" />
              {onlineUsers.length > 0 && (
                <span className="ml-1 text-xs text-gray-600">({onlineUsers.length})</span>
              )}
            </button>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Online Users strip for non-YenAI */}
      {!isYenAI && showOnlineUsers && (
        <div className="border-b p-4 bg-gray-50">
          <h3 className="font-semibold text-sm mb-2">Online Now</h3>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((u) => (
              <div key={u.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">{u.full_name || u.email || "Anonymous"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isYenAI ? (
        <>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white">
            {isLoadingHistory && (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}

            {yenaiMessages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}>
                {!message.isOwn && (
                  message.author === "YenAI" ? (
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-[#B2E8D8] flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </div>
                  ) : (
                    <img
                      src={message.avatar || "/placeholder.svg"}
                      alt={message.author}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )
                )}

                <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                  {!message.isOwn && <p className="text-xs font-semibold text-gray-700 mb-1">{message.author}</p>}

                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${message.isOwn
                      ? "bg-[#2D9B8F] text-white rounded-br-none"
                      : "bg-gradient-to-r from-[#D4F5ED] to-white text-gray-900 rounded-bl-none border border-[#B2E8D8]"
                      }`}
                  >
                    <div className="text-sm break-words prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-[#B2E8D8] flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-xs font-semibold text-gray-700 mb-1">YenAI</p>
                  <div className="px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg bg-gradient-to-r from-[#D4F5ED] to-white text-gray-900 rounded-bl-none border border-[#B2E8D8] flex items-center">
                    <p>...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* YenAI Input */}
          <div className="p-4 md:p-6 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B8F]"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="p-2 bg-[#2D9B8F] text-white rounded-lg hover:bg-[#1f7a6f] transition-colors flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage(message) ? "order-2" : "order-1"}`}>
                      {/* Sender info for other users */}
                      {!isOwnMessage(message) && (
                        <div className="flex items-center space-x-2 mb-1">
                          {message.avatar_url ? (
                            <img
                              src={message.avatar_url}
                              alt={message.full_name || message.email}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs">
                                {(message.full_name || message.email || "A").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-semibold text-gray-800">{message.full_name || message.email}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`px-4 py-2 rounded-lg ${isOwnMessage(message)
                          ? "bg-[#2D9B8F] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                      >
                        {message.reply_to && message.reply_content && (
                          <div className="text-xs opacity-75 mb-1 border-l-2 border-current pl-2">
                            <p>Replying to {message.reply_author_name || message.reply_author_email}</p>
                            <p className="truncate">{message.reply_content}</p>
                          </div>
                        )}

                        <p className="break-words">{message.content}</p>

                        {message.is_edited && <p className="text-xs opacity-75 mt-1">edited</p>}
                      </div>

                      {/* "You" and timestamp for own messages */}
                      {isOwnMessage(message) && (
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          <span className="text-xs text-gray-500">You</span>
                          <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
                        </div>
                      )}

                      {/* Actions */}
                      {isOwnMessage(message) && (
                        <div className="flex space-x-2 mt-1 justify-end">
                          <button onClick={() => handleEditMessage(message)} className="p-1 hover:bg-gray-200 rounded">
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {!isOwnMessage(message) && (
                        <div className="flex space-x-2 mt-1">
                          <button onClick={() => handleReply(message)} className="p-1 hover:bg-gray-200 rounded">
                            <Reply className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span>
                      {typingUsers.length === 1
                        ? `${typingUsers[0].name} is typing...`
                        : typingUsers.length === 2
                          ? `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`
                          : `${typingUsers.slice(0, 2).map(u => u.name).join(', ')} and ${typingUsers.length - 2} others are typing...`
                      }
                    </span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply preview */}
          {replyingTo && (
            <div className="border-t p-2 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Replying to {replyingTo.full_name || replyingTo.email}</div>
                <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4 bg-white">
            {error && <div className="mb-2 p-2 bg-red-100 text-red-600 rounded text-sm">{error}</div>}

            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-3">
              <button className="text-gray-400 hover:text-gray-600">
                <Paperclip className="h-5 w-5" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value)
                  handleTyping()
                }}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              />

              <button
                onClick={handleSubmit}
                disabled={!messageInput.trim() || isLoading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
