import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { dmSocketService } from '@/api/socket.service';
import { useMessageStore } from '@/stores/useMessageStore';
import { useOnlineStore } from '@/stores/useOnlineStore';
import { useUnreadStore } from '@/stores/useUnreadStore';

export function useSocket() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      dmSocketService.disconnect();
      return;
    }

    dmSocketService.connect(token);

    const handleConnect = () => {
      dmSocketService.getOnlineUsers();
      useMessageStore.getState().fetchConversations();
    };

    const handleMessageNew = (message) => {
      useMessageStore.getState().addIncomingMessage(message.conversationId, message);

      const currentConvId = useMessageStore.getState().selectedConversationId;
      if (currentConvId !== message.conversationId) {
        useUnreadStore.getState().incrementUnread(message.conversationId);
      } else {
        dmSocketService.markAsRead(message.conversationId);
      }
    };

    const handleReadReceipt = ({ conversationId, readBy, messageIds }) => {
      useMessageStore.getState().updateMessagesReadStatus(conversationId, messageIds, readBy);
    };

    const handleUsersOnline = (userIds) => {
      useOnlineStore.getState().setOnlineUsers(userIds);
    };

    const handleUserOnline = ({ userId }) => {
      useOnlineStore.getState().addOnlineUser(userId);
    };

    const handleUserOffline = ({ userId }) => {
      useOnlineStore.getState().removeOnlineUser(userId);
    };

    dmSocketService.on('connect', handleConnect);
    dmSocketService.on('message:new', handleMessageNew);
    dmSocketService.on('messages:read_receipt', handleReadReceipt);
    dmSocketService.on('users:online', handleUsersOnline);
    dmSocketService.on('user:online', handleUserOnline);
    dmSocketService.on('user:offline', handleUserOffline);

    return () => {
      dmSocketService.off('connect', handleConnect);
      dmSocketService.off('message:new', handleMessageNew);
      dmSocketService.off('messages:read_receipt', handleReadReceipt);
      dmSocketService.off('users:online', handleUsersOnline);
      dmSocketService.off('user:online', handleUserOnline);
      dmSocketService.off('user:offline', handleUserOffline);
      dmSocketService.disconnect();
    };
  }, [isAuthenticated, token]);
}
