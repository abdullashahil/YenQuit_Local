"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, ArrowLeft, MoreVertical, X, Sparkles } from "lucide-react"
import axios from "axios"
import ReactMarkdown from "react-markdown"

const TEST_USER_ID = "d5799f0c-f707-415e-b9ea-68816351912c"; // Valid UUID for testing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Message {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  isOwn: boolean
}

const communityData: Record<string, { name: string; members: number; online: number; messages: Message[] }> = {
  "wequit-team": {
    name: "WeQuit Team",
    members: 12,
    online: 8,
    messages: [
      {
        id: "1",
        author: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        content:
          "Hey everyone! I've just uploaded the latest design mockups to the shared folder. Would love to get your feedback!",
        timestamp: "10:30 AM",
        isOwn: false,
      },
      {
        id: "2",
        author: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        content:
          "Looks amazing! The color scheme really pops. Just one suggestion - maybe we could make the buttons a bit more prominent?",
        timestamp: "10:32 AM",
        isOwn: false,
      },
      {
        id: "3",
        author: "You",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        content:
          "Great point Alex! I'll make that adjustment. Also thinking we should add some micro-interactions to make it feel more engaging.",
        timestamp: "10:35 AM",
        isOwn: true,
      },
      {
        id: "4",
        author: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        content: "From a dev perspective, the designs look very feasible. Should be able to implement the",
        timestamp: "10:38 AM",
        isOwn: false,
      },
    ],
  },
  "marketing-squad": {
    name: "Marketing Squad",
    members: 8,
    online: 5,
    messages: [
      {
        id: "1",
        author: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        content: "Let's schedule the campaign review for next week",
        timestamp: "1:00 PM",
        isOwn: false,
      },
    ],
  },
  "dev-team": {
    name: "Dev Team",
    members: 15,
    online: 10,
    messages: [
      {
        id: "1",
        author: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        content: "Code review is complete",
        timestamp: "3:00 PM",
        isOwn: false,
      },
    ],
  },
  "yenai-chat": {
    name: "YenAI",
    members: 1,
    online: 1,
    messages: [
      {
        id: "1",
        author: "YenAI",
        avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F5A623'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E",
        content: "Hello! I'm YenAI, your personal assistant. How can I help you today?",
        timestamp: "Now",
        isOwn: false,
      },
      // {
      //   id: "2",
      //   author: "YenAI",
      //   avatar:
      //     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333333' width='100' height='100'/%3E%3Ctext x='50' y='50' fontSize='60' fill='white' textAnchor='middle' dy='.3em'%3E✨%3C/text%3E%3C/svg%3E",
      //   content:
      //     "I can help you with questions about your communities, provide suggestions, or assist with any tasks you need. What would you like to know?",
      //   timestamp: "Now",
      //   isOwn: false,
      // },
    ],
  },
}

interface ChatAreaProps {
  communityId: string | null
  onBack?: () => void
  onClose?: () => void
}

export function ChatArea({ communityId, onBack, onClose }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [yenaiMessages, setYenaiMessages] = useState<Message[]>([])
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const community = communityId ? communityData[communityId] : null
  const isYenAI = communityId === "yenai-chat"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatHistory = useCallback(async () => {
    if (!isYenAI) return;
    
    setIsLoadingHistory(true);
    try {
      // In production, get userId from auth context
          const userId = TEST_USER_ID;
      const response = await axios.get(`${API_BASE_URL}/yenquit-chat/history/${userId}`);
      
      if (response.data?.success && Array.isArray(response.data.history)) {
        const historyMessages = response.data.history.map((msg: any) => ({
          id: `${msg.role}-${msg.timestamp || Date.now()}`,
          author: msg.role === 'user' ? 'You' : 'YenAI',
          avatar: msg.role === 'user' 
            ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333333' width='100' height='100'/%3E%3Ctext x='50' y='50' fontSize='60' fill='white' textAnchor='middle' dy='.3em'%E2%9C%A8%3C/text%3E%3C/svg%3E",
          content: msg.content,
          timestamp: msg.timestamp 
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now',
          isOwn: msg.role === 'user'
        }));
        
        setYenaiMessages(historyMessages.length > 0 ? historyMessages : communityData["yenai-chat"].messages);
      } else {
        setYenaiMessages(communityData["yenai-chat"].messages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setYenaiMessages(communityData["yenai-chat"].messages);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isYenAI]);

  useEffect(() => {
    if (isYenAI) {
      fetchChatHistory();
    } else if (communityId) {
      setYenaiMessages(communityData[communityId]?.messages || []);
    }
  }, [isYenAI, communityId, fetchChatHistory])

  useEffect(() => {
    scrollToBottom()
  }, [yenaiMessages, isLoading])

  if (!community) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a community to start chatting</p>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim()
    if (!trimmed || isLoading) return

    // For now, only YenAI supports dynamic messaging
    if (!isYenAI) {
      setMessageInput("")
      return
    }

    const userMessage: Message = {
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
    setMessageInput("")
    setError(null)
    setIsLoading(true)

    try {
      const maxHistoryMessages = 10
      const recentMessages = updatedMessages.slice(-maxHistoryMessages)
      const history = recentMessages.map((msg) => ({
        role: msg.isOwn ? "user" : "assistant",
        content: msg.content,
      }))

      // In production, get userId from auth context
          const userId = TEST_USER_ID;
      
      const response = await axios.post(`${API_BASE_URL}/yenquit-chat`, {
        message: trimmed,
        history,
        summary,
        userId: userId
      })

      const replyText: string =
        response.data?.reply || response.data?.message || "Sorry, I could not generate a response."

      if (typeof response.data?.summary === "string" && response.data.summary.trim().length > 0) {
        setSummary(response.data.summary.trim())
      }

      const aiMessage: Message = {
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

  const messagesToRender = isYenAI ? yenaiMessages : community.messages

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
                {community.members} members • {community.online} online
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white">
        {isLoadingHistory && (
          <div className="flex justify-center py-4">
            <div className="animate-pulse text-gray-500 text-sm">Loading chat history...</div>
          </div>
        )}
        {messagesToRender.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}>
            {!message.isOwn && (
              message.author === 'YenAI' ? (
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
                className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                  message.isOwn
                    ? "bg-[#2D9B8F] text-white rounded-br-none"
                    : isYenAI
                      ? "bg-gradient-to-r from-[#D4F5ED] to-white text-gray-900 rounded-bl-none border border-[#B2E8D8]"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {isYenAI && !message.isOwn ? (
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
                ) : (
                  <p className="text-sm break-words">{message.content}</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
        {isYenAI && isLoading && (
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

      {/* Message Input */}
      <div className="p-4 md:p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D9B8F]"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="p-2 bg-[#2D9B8F] text-white rounded-lg hover:bg-[#1f7a6f] transition-colors flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}
