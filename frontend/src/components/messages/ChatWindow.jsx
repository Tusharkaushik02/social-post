import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/router/routes';
import { useMessageStore } from '@/stores/useMessageStore';
import { useUnreadStore } from '@/stores/useUnreadStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ChatHeader from '@/components/messages/ChatHeader';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';
import { dmSocketService } from '@/api/socket.service';

export default function ChatWindow({ conversationId }) {
  const navigate = useNavigate();
  const { conversations, fetchConversations, fetchMessages, selectConversation } = useMessageStore();
  const { clearUnread } = useUnreadStore();
  const { user } = useAuthStore();
  const currentUserId = user?._id || null;

  useEffect(() => {
    if (conversations.length === 0) {
      fetchConversations();
    }
  }, [conversations.length, fetchConversations]);

  useEffect(() => {
    if (conversationId) {
      selectConversation(conversationId);
      fetchMessages(conversationId);
      clearUnread(conversationId);

      dmSocketService.joinConversation(conversationId);
      dmSocketService.markAsRead(conversationId);

      return () => {
        dmSocketService.leaveConversation(conversationId);
        selectConversation(null);
      };
    }
  }, [conversationId, selectConversation, fetchMessages, clearUnread]);

  const handleBack = () => {
    navigate(ROUTES.MESSAGES);
  };

  const conversation = conversations.find(c => c._id === conversationId);
  const partner = conversation?.participants?.find(p => p._id !== currentUserId) || conversation?.participants?.[0] || {};
  const displayName = partner?.displayName || partner?.username || '';

  if (!conversation) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--color-on-surface-variant)',
      }}>
        {/* Loading state */}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--color-background)',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <ChatHeader
          conversation={conversation}
          partner={partner}
          onBack={handleBack}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MessageList
          conversationId={conversationId}
          currentUserId={currentUserId}
          partner={partner}
        />
      </div>

      <div style={{ flexShrink: 0 }}>
        <MessageInput
          conversationId={conversationId}
          recipientName={displayName}
        />
      </div>
    </motion.div>
  );
}
