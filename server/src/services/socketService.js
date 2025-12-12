import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/token.js';
import ChatMessageModel from '../models/ChatMessageModel.js';
import CommunityModel from '../models/CommunityModel.js';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> { socket, communities }
  }

  // Initialize Socket.IO server
  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user authentication and join communities
      socket.on('authenticate', async (data) => {
        try {
          const { userId, token } = data;
          
          // Verify JWT token
          const payload = verifyAccessToken(token);
          
          // Ensure the userId from token matches the provided userId
          if (payload.userId !== userId) {
            throw new Error('User ID mismatch');
          }
          
          // Store user connection info
          if (!this.connectedUsers.has(userId)) {
            this.connectedUsers.set(userId, {
              socket: socket,
              communities: new Set()
            });
          } else {
            this.connectedUsers.get(userId).socket = socket;
          }

          socket.userId = userId;
          socket.emit('authenticated', { success: true });
          
          console.log(`User ${userId} authenticated`);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('authentication_error', { error: 'Authentication failed' });
        }
      });

      // Handle joining a community room
      socket.on('join_community', async (data) => {
        try {
          const { communityId } = data;
          const userId = socket.userId;

          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          // Check if user is member of community
          const membership = await CommunityModel.isMember(communityId, userId);
          if (!membership) {
            socket.emit('error', { message: 'Not a member of this community' });
            return;
          }

          // Join socket room
          socket.join(`community_${communityId}`);
          
          // Track user in community
          await ChatMessageModel.trackOnlineUser(communityId, userId, socket.id);
          
          // Update user's communities
          const userConnection = this.connectedUsers.get(userId);
          if (userConnection) {
            userConnection.communities.add(communityId);
          }

          // Notify other members
          socket.to(`community_${communityId}`).emit('user_joined', {
            userId,
            communityId
          });

          // Send online users list
          const onlineUsers = await ChatMessageModel.getOnlineUsers(communityId);
          this.io.to(`community_${communityId}`).emit('online_users_updated', onlineUsers);

          socket.emit('joined_community', { communityId });
          console.log(`User ${userId} joined community ${communityId}`);
        } catch (error) {
          console.error('Error joining community:', error);
          socket.emit('error', { message: 'Failed to join community' });
        }
      });

      // Handle leaving a community room
      socket.on('leave_community', async (data) => {
        try {
          const { communityId } = data;
          const userId = socket.userId;

          if (!userId) return;

          // Leave socket room
          socket.leave(`community_${communityId}`);
          
          // Remove user from online tracking
          await ChatMessageModel.removeOnlineUser(communityId, userId);
          
          // Update user's communities
          const userConnection = this.connectedUsers.get(userId);
          if (userConnection) {
            userConnection.communities.delete(communityId);
          }

          // Notify other members
          socket.to(`community_${communityId}`).emit('user_left', {
            userId,
            communityId
          });

          // Send updated online users list
          const onlineUsers = await ChatMessageModel.getOnlineUsers(communityId);
          this.io.to(`community_${communityId}`).emit('online_users_updated', onlineUsers);

          socket.emit('left_community', { communityId });
          console.log(`User ${userId} left community ${communityId}`);
        } catch (error) {
          console.error('Error leaving community:', error);
          socket.emit('error', { message: 'Failed to leave community' });
        }
      });

      // Handle sending messages
      socket.on('send_message', async (data) => {
        try {
          const { communityId, content, messageType = 'text', fileUrl = null, replyTo = null } = data;
          const userId = socket.userId;

          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          // Check if user is member
          const membership = await CommunityModel.isMember(communityId, userId);
          if (!membership) {
            socket.emit('error', { message: 'Not a member of this community' });
            return;
          }

          // Create message
          const messageData = {
            community_id: communityId,
            user_id: userId,
            content: content.trim(),
            message_type: messageType,
            file_url: fileUrl,
            reply_to: replyTo
          };

          const message = await ChatMessageModel.create(messageData);
          
          // Get full message with user details
          const fullMessage = await ChatMessageModel.findById(message.id);

          // Broadcast to all members in community
          this.io.to(`community_${communityId}`).emit('new_message', fullMessage);

          console.log(`Message sent in community ${communityId} by user ${userId}`);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle message editing
      socket.on('edit_message', async (data) => {
        try {
          const { messageId, content } = data;
          const userId = socket.userId;

          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          const message = await ChatMessageModel.editMessage(messageId, userId, content.trim());
          
          if (!message) {
            socket.emit('error', { message: 'Message not found or no permission' });
            return;
          }

          // Get full message with user details
          const fullMessage = await ChatMessageModel.findById(messageId);

          // Get community ID to broadcast to correct room
          const communityId = fullMessage.community_id;
          
          // Broadcast to all members in community
          this.io.to(`community_${communityId}`).emit('message_edited', fullMessage);

          console.log(`Message ${messageId} edited by user ${userId}`);
        } catch (error) {
          console.error('Error editing message:', error);
          socket.emit('error', { message: 'Failed to edit message' });
        }
      });

      // Handle message deletion
      socket.on('delete_message', async (data) => {
        try {
          const { messageId } = data;
          const userId = socket.userId;

          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          // Get message details before deletion to know which community to notify
          const message = await ChatMessageModel.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          const deleted = await ChatMessageModel.deleteMessage(messageId, userId);
          
          if (!deleted) {
            socket.emit('error', { message: 'No permission to delete this message' });
            return;
          }

          // Broadcast to all members in community
          this.io.to(`community_${message.community_id}`).emit('message_deleted', { messageId });

          console.log(`Message ${messageId} deleted by user ${userId}`);
        } catch (error) {
          console.error('Error deleting message:', error);
          socket.emit('error', { message: 'Failed to delete message' });
        }
      });

      // Handle adding reactions
      socket.on('add_reaction', async (data) => {
        try {
          const { messageId, emoji } = data;
          const userId = socket.userId;

          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          // Check if message exists and user has access
          const message = await ChatMessageModel.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          // Check if user is member of the community
          const membership = await CommunityModel.isMember(message.community_id, userId);
          if (!membership) {
            socket.emit('error', { message: 'Not a member of this community' });
            return;
          }

          const reaction = await ChatMessageModel.addReaction(messageId, userId, emoji);
          
          // Get updated reactions list
          const reactions = await ChatMessageModel.getReactions(messageId);

          // Broadcast to all members in community
          this.io.to(`community_${message.community_id}`).emit('reaction_added', {
            messageId,
            reactions
          });

          console.log(`Reaction added to message ${messageId} by user ${userId}`);
        } catch (error) {
          console.error('Error adding reaction:', error);
          socket.emit('error', { message: 'Failed to add reaction' });
        }
      });

      // Handle removing reactions
      socket.on('remove_reaction', async (data) => {
        try {
          const { messageId, emoji } = data;
          const userId = socket.userId;

          if (!userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          // Get message details to know which community to notify
          const message = await ChatMessageModel.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          const removed = await ChatMessageModel.removeReaction(messageId, userId, emoji);
          
          if (!removed) {
            socket.emit('error', { message: 'Reaction not found' });
            return;
          }

          // Get updated reactions list
          const reactions = await ChatMessageModel.getReactions(messageId);

          // Broadcast to all members in community
          this.io.to(`community_${message.community_id}`).emit('reaction_removed', {
            messageId,
            reactions
          });

          console.log(`Reaction removed from message ${messageId} by user ${userId}`);
        } catch (error) {
          console.error('Error removing reaction:', error);
          socket.emit('error', { message: 'Failed to remove reaction' });
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { communityId } = data;
        const userId = socket.userId;

        if (!userId) return;

        socket.to(`community_${communityId}`).emit('user_typing', {
          userId,
          communityId
        });
      });

      socket.on('typing_stop', (data) => {
        const { communityId } = data;
        const userId = socket.userId;

        if (!userId) return;

        socket.to(`community_${communityId}`).emit('user_stop_typing', {
          userId,
          communityId
        });
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        try {
          const userId = socket.userId;
          
          if (userId) {
            const userConnection = this.connectedUsers.get(userId);
            
            if (userConnection) {
              // Remove user from all community online tracking
              for (const communityId of userConnection.communities) {
                await ChatMessageModel.removeOnlineUser(communityId, userId);
                
                // Notify other members
                socket.to(`community_${communityId}`).emit('user_left', {
                  userId,
                  communityId
                });

                // Send updated online users list
                const onlineUsers = await ChatMessageModel.getOnlineUsers(communityId);
                this.io.to(`community_${communityId}`).emit('online_users_updated', onlineUsers);
              }
              
              this.connectedUsers.delete(userId);
            }
          }

          console.log(`User disconnected: ${socket.id}`);
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    });

    console.log('Socket.IO server initialized');
  }

  // Get online users count for a community
  async getOnlineUserCount(communityId) {
    try {
      const onlineUsers = await ChatMessageModel.getOnlineUsers(communityId);
      return onlineUsers.length;
    } catch (error) {
      console.error('Error getting online user count:', error);
      return 0;
    }
  }

  // Broadcast to a specific community
  broadcastToCommunity(communityId, event, data) {
    if (this.io) {
      this.io.to(`community_${communityId}`).emit(event, data);
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
