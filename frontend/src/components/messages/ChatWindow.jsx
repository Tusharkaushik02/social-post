import { useEffect } from 'react';
import { useMessageStore } from '@/stores/useMessageStore';
import { useUnreadStore } from '@/stores/useUnreadStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import EmptyChat from './EmptyChat';

export default function ChatWindow({ conversationId, onBack }) {
  const { conversations, fetchMessages } = useMessageStore();
  const { clearUnread } = useUnreadStore();
  const { user } = useAuthStore();
  
  const currentUserId = user?._id || 'current_user';
  
  const conversation = conversations.find(c => c._id === conversationId);
  const partner = conversation?.participants?.[0] || {};
  const displayName = partner.displayName || partner.username || '';

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      clearUnread(conversationId);
      
      // TODO: socket.joinConversation(conversationId)
      
      return () => {
        // TODO: socket.leaveConversation(conversationId)
      };
    }
  }, [conversationId, fetchMessages, clearUnread]);

  if (!conversationId) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-bright)' }}>
        <EmptyChat variant="no-conversation" />
      </div>
    );
  }

  if (!conversation) {
    return null; // or loading
  }

  return (
    <div className="messages-chat" style={{ height: '100%', position: 'relative' }}>
      <ChatHeader 
        conversation={conversation} 
        onBack={onBack} 
      />
      
      <MessageList 
        conversationId={conversationId} 
        currentUserId={currentUserId}
        partner={partner}
      />
      
      <MessageInput 
        conversationId={conversationId}
        recipientName={displayName}
      />
    </div>
  );
}
