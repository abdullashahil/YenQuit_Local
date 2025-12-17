import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  community_id: number;
  user_id: number;
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
  id: number;
  user_id: number;
  community_id: number;
  socket_id: string;
  last_seen: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
}

interface Reaction {
  id: number;
  message_id: number;
  user_id: number;
  emoji: string;
  created_at: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
}

class SocketService {
  private socket: Socket | null = null;
  private userId: number | null = null;
  private currentCommunity: string | null = null;

  // Connect to Socket.IO server
  connect(userId: number, token: string) {
    // If already connected with same user, don't reconnect
    if (this.socket && this.userId === userId) {
      console.log('DEBUG: Socket already connected for user:', userId)
      return this.socket;
    }

    // Disconnect existing connection if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.userId = userId;
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    this.socket = io(API_BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });
    
    this.setupEventListeners();
    
    // Send authentication event after connecting
    this.socket.on('connect', () => {
      console.log('DEBUG: Socket connected, authenticating user:', userId)
      this.socket?.emit('authenticate', { userId, token });
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
  joinCommunity(communityId: number) {
    if (this.socket && this.userId) {
      this.currentCommunity = communityId;
      this.socket.emit('join_community', { communityId });
    }
  }

  // Leave a community room
  leaveCommunity(communityId: number) {
    if (this.socket && this.userId) {
      this.socket.emit('leave_community', { communityId });
      if (this.currentCommunity === communityId) {
        this.currentCommunity = null;
      }
    }
  }

  // Send a message
  sendMessage(communityId: number, content: string, messageType: 'text' | 'image' | 'file' = 'text', fileUrl?: string, replyTo?: number) {
    if (this.socket && this.userId) {
      this.socket.emit('send_message', {
        communityId,
        content,
        messageType,
        fileUrl,
        replyTo
      });
    }
  }

  // Edit a message
  editMessage(messageId: number, content: string) {
    if (this.socket && this.userId) {
      this.socket.emit('edit_message', { messageId, content });
    }
  }

  // Delete a message
  deleteMessage(messageId: number) {
    if (this.socket && this.userId) {
      this.socket.emit('delete_message', { messageId });
    }
  }

  // Add reaction to message
  addReaction(messageId: number, emoji: string) {
    if (this.socket && this.userId) {
      this.socket.emit('add_reaction', { messageId, emoji });
    }
  }

  // Remove reaction from message
  removeReaction(messageId: number, emoji: string) {
    if (this.socket && this.userId) {
      this.socket.emit('remove_reaction', { messageId, emoji });
    }
  }

  // Start typing indicator
  startTyping(communityId: number) {
    if (this.socket && this.userId) {
      this.socket.emit('typing_start', { communityId });
    }
  }

  // Stop typing indicator
  stopTyping(communityId: number) {
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
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.on('authenticated', (data) => {
      console.log('Authenticated with Socket.IO server:', data);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('Socket.IO authentication error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  }

  // Event listener methods
  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('new_message', callback);
  }

  onMessageEdited(callback: (message: Message) => void) {
    this.socket?.on('message_edited', callback);
  }

  onMessageDeleted(callback: (data: { messageId: number }) => void) {
    this.socket?.on('message_deleted', callback);
  }

  onReactionAdded(callback: (data: { messageId: number; reactions: Reaction[] }) => void) {
    this.socket?.on('reaction_added', callback);
  }

  onReactionRemoved(callback: (data: { messageId: number; reactions: Reaction[] }) => void) {
    this.socket?.on('reaction_removed', callback);
  }

  onUserJoined(callback: (data: { userId: number; communityId: number }) => void) {
    this.socket?.on('user_joined', callback);
  }

  onUserLeft(callback: (data: { userId: number; communityId: number }) => void) {
    this.socket?.on('user_left', callback);
  }

  onOnlineUsersUpdated(callback: (users: OnlineUser[]) => void) {
    this.socket?.on('online_users_updated', callback);
  }

  onUserTyping(callback: (data: { userId: number; communityId: number }) => void) {
    this.socket?.on('user_typing', callback);
  }

  onUserStopTyping(callback: (data: { userId: number; communityId: number }) => void) {
    this.socket?.on('user_stop_typing', callback);
  }

  // Remove event listeners
  offNewMessage(callback?: (message: Message) => void) {
    this.socket?.off('new_message', callback);
  }

  offMessageEdited(callback?: (message: Message) => void) {
    this.socket?.off('message_edited', callback);
  }

  offMessageDeleted(callback?: (data: { messageId: number }) => void) {
    this.socket?.off('message_deleted', callback);
  }

  offReactionAdded(callback?: (data: { messageId: number; reactions: Reaction[] }) => void) {
    this.socket?.off('reaction_added', callback);
  }

  offReactionRemoved(callback?: (data: { messageId: number; reactions: Reaction[] }) => void) {
    this.socket?.off('reaction_removed', callback);
  }

  offUserJoined(callback?: (data: { userId: number; communityId: number }) => void) {
    this.socket?.off('user_joined', callback);
  }

  offUserLeft(callback?: (data: { userId: number; communityId: number }) => void) {
    this.socket?.off('user_left', callback);
  }

  offOnlineUsersUpdated(callback?: (users: OnlineUser[]) => void) {
    this.socket?.off('online_users_updated', callback);
  }

  offUserTyping(callback?: (data: { userId: number; communityId: number }) => void) {
    this.socket?.off('user_typing', callback);
  }

  offUserStopTyping(callback?: (data: { userId: number; communityId: number }) => void) {
    this.socket?.off('user_stop_typing', callback);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
export type { Message, OnlineUser, Reaction };
