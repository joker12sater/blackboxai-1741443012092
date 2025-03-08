const { formatDate, sanitizeInput } = require('../utils/helpers');

// Store active chat rooms and their messages
const chatRooms = new Map();
const userSessions = new Map();

class ChatHandler {
    constructor(io) {
        this.io = io;
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);

            // Store user session
            userSessions.set(socket.id, {
                joinedRooms: new Set(),
                lastActivity: new Date()
            });

            // Handle joining a room
            socket.on('join_room', (data) => {
                this.handleJoinRoom(socket, data);
            });

            // Handle leaving a room
            socket.on('leave_room', (data) => {
                this.handleLeaveRoom(socket, data);
            });

            // Handle sending messages
            socket.on('send_message', (data) => {
                this.handleMessage(socket, data);
            });

            // Handle typing status
            socket.on('typing_status', (data) => {
                this.handleTypingStatus(socket, data);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }

    handleJoinRoom(socket, data) {
        try {
            const { roomId, username } = data;
            
            if (!roomId) {
                socket.emit('error', { message: 'Room ID is required' });
                return;
            }

            // Create room if it doesn't exist
            if (!chatRooms.has(roomId)) {
                chatRooms.set(roomId, {
                    messages: [],
                    users: new Set(),
                    createdAt: new Date()
                });
            }

            // Join the room
            socket.join(roomId);
            chatRooms.get(roomId).users.add(socket.id);
            userSessions.get(socket.id).joinedRooms.add(roomId);

            // Notify room about new user
            this.io.to(roomId).emit('user_joined', {
                userId: socket.id,
                username: username || 'Anonymous',
                timestamp: formatDate(new Date())
            });

            // Send room history to new user
            socket.emit('room_history', {
                roomId,
                messages: chatRooms.get(roomId).messages
            });

            console.log(`User ${socket.id} joined room ${roomId}`);
        } catch (error) {
            console.error('Error in handleJoinRoom:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    }

    handleLeaveRoom(socket, data) {
        try {
            const { roomId } = data;
            
            if (!roomId) {
                socket.emit('error', { message: 'Room ID is required' });
                return;
            }

            this.leaveRoom(socket, roomId);
        } catch (error) {
            console.error('Error in handleLeaveRoom:', error);
            socket.emit('error', { message: 'Failed to leave room' });
        }
    }

    handleMessage(socket, data) {
        try {
            const { roomId, message, username } = data;
            
            if (!roomId || !message) {
                socket.emit('error', { message: 'Room ID and message are required' });
                return;
            }

            const sanitizedMessage = sanitizeInput(message);
            const messageObject = {
                id: Date.now().toString(),
                sender: {
                    id: socket.id,
                    username: username || 'Anonymous'
                },
                content: sanitizedMessage,
                timestamp: formatDate(new Date())
            };

            // Store message in room history
            if (chatRooms.has(roomId)) {
                chatRooms.get(roomId).messages.push(messageObject);
                // Keep only last 100 messages
                if (chatRooms.get(roomId).messages.length > 100) {
                    chatRooms.get(roomId).messages.shift();
                }
            }

            // Broadcast message to room
            this.io.to(roomId).emit('new_message', messageObject);
        } catch (error) {
            console.error('Error in handleMessage:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    }

    handleTypingStatus(socket, data) {
        try {
            const { roomId, isTyping, username } = data;
            
            if (!roomId) {
                socket.emit('error', { message: 'Room ID is required' });
                return;
            }

            // Broadcast typing status to room except sender
            socket.to(roomId).emit('typing_status', {
                userId: socket.id,
                username: username || 'Anonymous',
                isTyping
            });
        } catch (error) {
            console.error('Error in handleTypingStatus:', error);
            socket.emit('error', { message: 'Failed to update typing status' });
        }
    }

    handleDisconnect(socket) {
        try {
            const userSession = userSessions.get(socket.id);
            if (userSession) {
                // Leave all joined rooms
                userSession.joinedRooms.forEach(roomId => {
                    this.leaveRoom(socket, roomId);
                });
                userSessions.delete(socket.id);
            }
            console.log('Client disconnected:', socket.id);
        } catch (error) {
            console.error('Error in handleDisconnect:', error);
        }
    }

    leaveRoom(socket, roomId) {
        try {
            socket.leave(roomId);
            
            const room = chatRooms.get(roomId);
            if (room) {
                room.users.delete(socket.id);
                
                // Notify room about user leaving
                this.io.to(roomId).emit('user_left', {
                    userId: socket.id,
                    timestamp: formatDate(new Date())
                });

                // Clean up empty rooms
                if (room.users.size === 0) {
                    chatRooms.delete(roomId);
                }
            }

            const userSession = userSessions.get(socket.id);
            if (userSession) {
                userSession.joinedRooms.delete(roomId);
            }

            console.log(`User ${socket.id} left room ${roomId}`);
        } catch (error) {
            console.error('Error in leaveRoom:', error);
            socket.emit('error', { message: 'Failed to leave room' });
        }
    }
}

module.exports = ChatHandler;
