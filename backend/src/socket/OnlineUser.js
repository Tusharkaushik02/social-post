class OnlineUser {
    constructor() {
        this.users = new Map(); // userId -> Set of socketIds
    }

    addUser(userId, socketId) {
        if (!this.users.has(userId)) {
            this.users.set(userId, new Set());
        }
        this.users.get(userId).add(socketId);
    }

    removeUser(userId, socketId) {
        if (this.users.has(userId)) {
            this.users.get(userId).delete(socketId);
            if (this.users.get(userId).size === 0) {
                this.users.delete(userId);
            }
        }
    }

    getUserSockets(userId) {
        return this.users.get(userId) || new Set();
    }

    isOnline(userId) {
        return this.users.has(userId);
    }

    getAllOnlineUserIds() {
        return Array.from(this.users.keys());
    }
}

const onlineUsers = new OnlineUser();
module.exports = onlineUsers;
