import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

class ChatManager {
    constructor() {
        this.socket = null;
        this.currentRoom = null;
        this.username = null;
        this.handlers = {
            onMessage: () => {},
            onUserJoined: () => {},
            onUserLeft: () => {},
            onTyping: () => {},
            onError: () => {}
        };
    }

    // Initialize socket connection
    connect(username) {
        this.username = username;
        this.socket = io('http://localhost:5000', {
            transports: ['websocket'],
            autoConnect: true
        });

        // Set up event listeners
        this.setupEventListeners();
    }

    // Set up socket event listeners
    setupEventListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to chat server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from chat server');
        });

        // Chat events
        this.socket.on('new_message', (data) => {
            this.handlers.onMessage(data);
        });

        this.socket.on('user_joined', (data) => {
            this.handlers.onUserJoined(data);
        });

        this.socket.on('user_left', (data) => {
            this.handlers.onUserLeft(data);
        });

        this.socket.on('typing_status', (data) => {
            this.handlers.onTyping(data);
        });

        this.socket.on('error', (error) => {
            this.handlers.onError(error);
            console.error('Chat error:', error);
        });

        this.socket.on('room_history', (data) => {
            if (data.roomId === this.currentRoom) {
                data.messages.forEach(msg => this.handlers.onMessage(msg));
            }
        });
    }

    // Join a chat room
    joinRoom(roomId) {
        if (this.socket && roomId) {
            this.currentRoom = roomId;
            this.socket.emit('join_room', {
                roomId,
                username: this.username
            });
        }
    }

    // Leave current room
    leaveRoom() {
        if (this.socket && this.currentRoom) {
            this.socket.emit('leave_room', {
                roomId: this.currentRoom
            });
            this.currentRoom = null;
        }
    }

    // Send a message
    sendMessage(message) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('send_message', {
                roomId: this.currentRoom,
                message,
                username: this.username
            });
        }
    }

    // Update typing status
    updateTypingStatus(isTyping) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('typing_status', {
                roomId: this.currentRoom,
                isTyping,
                username: this.username
            });
        }
    }

    // Set event handlers
    setHandlers(handlers) {
        this.handlers = {
            ...this.handlers,
            ...handlers
        };
    }

    // Disconnect from chat server
    disconnect() {
        if (this.currentRoom) {
            this.leaveRoom();
        }
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

// Create and export singleton instance
const chatManager = new ChatManager();
export default chatManager;
