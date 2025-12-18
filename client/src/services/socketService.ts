import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  community_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  reply_to?: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
  reply_content?: string;
  reply_author_email?: string;
  reply_author_name?: string;
  reply_author_avatar?: string;
}

interface OnlineUser {
  id: string;
  user_id: string;
  community_id: string;
  socket_id: string;
  last_seen: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
}

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
}

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private currentCommunity: string | null = null;

  // Connect to Socket.IO server
  connect(userId: string, token: string) {
    // If already connected with same user and socket is connected, don't reconnect
    if (this.socket && this.userId === userId && this.socket.connected) {
      return this.socket;
    }

    // If socket exists but not connected, try to reconnect
    if (this.socket && this.userId === userId && !this.socket.connected) {
      this.socket.connect();
      return this.socket;
    }

    // Disconnect existing connection if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.userId = userId;

    // Socket.IO connects to the base URL
    let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (API_BASE_URL.endsWith('/api')) {
      API_BASE_URL = API_BASE_URL.slice(0, -4);
    }

    this.socket = io(API_BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();

    // Send authentication event after connecting
    this.socket.on('connect', () => {
      this.socket?.emit('authenticate', { userId, token });
    });

    this.socket.on('disconnect', (reason) => {
      // Socket disconnected
    });

    this.socket.on('connect_error', (error) => {
      // Socket connection error
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
    this.currentCommunity = null;
  }

  // Join a community room
  joinCommunity(communityId: string) {
    if (!this.socket || !this.userId) {
      return;
    }

    this.currentCommunity = communityId;

    // If socket is connected, join immediately
    if (this.socket.connected) {
      this.socket.emit('join_community', { communityId });
    } else {
      // Wait for connection before joining
      this.socket.once('connect', () => {
        this.socket?.emit('join_community', { communityId });
      });
    }
  }

  // Leave a community room
  leaveCommunity(communityId: string) {
    if (this.socket && this.userId) {
      this.socket.emit('leave_community', { communityId });
      if (this.currentCommunity === communityId) {
        this.currentCommunity = null;
      }
    }
  }

  // Send a message
  sendMessage(communityId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text', fileUrl?: string, replyTo?: string) {
    if (!this.socket || !this.userId) {
      return;
    }

    // If socket is not connected, wait for connection
    if (!this.socket.connected) {
      const sendWhenConnected = () => {
        if (this.socket?.connected) {
          this.socket.emit('send_message', {
            communityId,
            content,
            messageType,
            fileUrl,
            replyTo
          });
        }
      };

      // Listen for connect event
      this.socket.once('connect', sendWhenConnected);

      // Set timeout to prevent waiting forever
      setTimeout(() => {
        this.socket?.off('connect', sendWhenConnected);
      }, 5000);

      return;
    }

    // Socket is connected, send immediately
    this.socket.emit('send_message', {
      communityId,
      content,
      messageType,
      fileUrl,
      replyTo
    });
  }

  // Edit a message
  editMessage(messageId: string, content: string) {
    if (this.socket && this.userId) {
      this.socket.emit('edit_message', { messageId, content });
    }
  }

  // Delete a message
  deleteMessage(messageId: string) {
    if (this.socket && this.userId) {
      this.socket.emit('delete_message', { messageId });
    }
  }

  // Add reaction to message
  addReaction(messageId: string, emoji: string) {
    if (this.socket && this.userId) {
      this.socket.emit('add_reaction', { messageId, emoji });
    }
  }

  // Remove reaction from message
  removeReaction(messageId: string, emoji: string) {
    if (this.socket && this.userId) {
      this.socket.emit('remove_reaction', { messageId, emoji });
    }
  }

  // Start typing indicator
  startTyping(communityId: string) {
    if (this.socket && this.userId) {
      this.socket.emit('typing_start', { communityId });
    }
  }

  // Stop typing indicator
  stopTyping(communityId: string) {
    if (this.socket && this.userId) {
      this.socket.emit('typing_stop', { communityId });
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get current community
  getCurrentCommunity(): string | null {
    return this.currentCommunity;
  }

  // Setup event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      // Connected to Socket.IO server
    });

    this.socket.on('disconnect', () => {
      // Disconnected from Socket.IO server
    });

    this.socket.on('authenticated', (data) => {
      // User authenticated
    });

    this.socket.on('authentication_error', (error) => {
      // Authentication error
    });

    this.socket.on('joined_community', (data) => {
      // Successfully joined community room
    });

    this.socket.on('error', (error) => {
      // Socket error
    });
  }

  // Event listener methods
  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('new_message', callback);
  }

  onMessageEdited(callback: (message: Message) => void) {
    this.socket?.on('message_edited', callback);
  }

  onMessageDeleted(callback: (data: { messageId: string }) => void) {
    this.socket?.on('message_deleted', callback);
  }

  onReactionAdded(callback: (data: { messageId: string; reactions: Reaction[] }) => void) {
    this.socket?.on('reaction_added', callback);
  }

  onReactionRemoved(callback: (data: { messageId: string; reactions: Reaction[] }) => void) {
    this.socket?.on('reaction_removed', callback);
  }

  onUserJoined(callback: (data: { userId: string; communityId: string }) => void) {
    this.socket?.on('user_joined', callback);
  }

  onUserLeft(callback: (data: { userId: string; communityId: string }) => void) {
    this.socket?.on('user_left', callback);
  }

  onOnlineUsersUpdated(callback: (users: OnlineUser[]) => void) {
    this.socket?.on('online_users_updated', callback);
  }

  onUserTyping(callback: (data: { userId: string; communityId: string }) => void) {
    this.socket?.on('user_typing', callback);
  }

  onUserStopTyping(callback: (data: { userId: string; communityId: string }) => void) {
    this.socket?.on('user_stop_typing', callback);
  }

  // Remove event listeners
  offNewMessage(callback?: (message: Message) => void) {
    this.socket?.off('new_message', callback);
  }

  offMessageEdited(callback?: (message: Message) => void) {
    this.socket?.off('message_edited', callback);
  }

  offMessageDeleted(callback?: (data: { messageId: string }) => void) {
    this.socket?.off('message_deleted', callback);
  }

  offReactionAdded(callback?: (data: { messageId: string; reactions: Reaction[] }) => void) {
    this.socket?.off('reaction_added', callback);
  }

  offReactionRemoved(callback?: (data: { messageId: string; reactions: Reaction[] }) => void) {
    this.socket?.off('reaction_removed', callback);
  }

  offUserJoined(callback?: (data: { userId: string; communityId: string }) => void) {
    this.socket?.off('user_joined', callback);
  }

  offUserLeft(callback?: (data: { userId: string; communityId: string }) => void) {
    this.socket?.off('user_left', callback);
  }

  offOnlineUsersUpdated(callback?: (users: OnlineUser[]) => void) {
    this.socket?.off('online_users_updated', callback);
  }

  offUserTyping(callback?: (data: { userId: string; communityId: string }) => void) {
    this.socket?.off('user_typing', callback);
  }

  offUserStopTyping(callback?: (data: { userId: string; communityId: string }) => void) {
    this.socket?.off('user_stop_typing', callback);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
export type { Message, OnlineUser, Reaction };
