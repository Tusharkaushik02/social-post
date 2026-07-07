import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config/constants';

function getSocketURL() {
    const baseURL = API_BASE_URL.replace(/\/api\/?$/, '');
    return baseURL || undefined;
}

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket) {
            if (this.socket.auth?.token === token && (this.socket.connected || this.socket.connecting)) {
                return this.socket;
            }
            this.disconnect();
        }

        if (!token) return null;

        this.socket = io(getSocketURL(), {
            auth: { token },
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 30000,
            timeout: 20000,
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('[Socket] Connected to backend');
        });

        this.socket.on('disconnect', () => {
            console.log('[Socket] Disconnected from backend');
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection failed:', error.message);
            if (error.message === 'Invalid or expired token' || error.message === 'Authentication required') {
                this.disconnect();
            }
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
    }

    sendMessage(conversationId, content, clientMessageId) {
        if (!this.socket) return;
        this.socket.emit('message:send', { conversationId, content, clientMessageId });
    }

    joinConversation(conversationId) {
        if (!this.socket) return;
        this.socket.emit('conversation:join', { conversationId });
    }

    leaveConversation(conversationId) {
        if (!this.socket) return;
        this.socket.emit('conversation:leave', { conversationId });
    }

    startTyping(conversationId) {
        if (!this.socket) return;
        this.socket.emit('typing:start', { conversationId });
    }

    stopTyping(conversationId) {
        if (!this.socket) return;
        this.socket.emit('typing:stop', { conversationId });
    }

    markAsRead(conversationId) {
        if (!this.socket) return;
        this.socket.emit('messages:read', { conversationId });
    }

    getOnlineUsers() {
        if (!this.socket) return;
        this.socket.emit('presence:get_online_users');
    }

    on(event, callback) {
        if (!this.socket) return;
        this.socket.on(event, callback);
    }

    off(event, callback) {
        if (!this.socket) return;
        this.socket.off(event, callback);
    }
}

export const dmSocketService = new SocketService();
