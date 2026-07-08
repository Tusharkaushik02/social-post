import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES, buildPath } from '@/router/routes';
import { useMessageStore } from '@/stores/useMessageStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import EmptyMessages from '@/components/messages/EmptyMessages';

export default function MessagesLayout() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { selectConversation } = useMessageStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  // Clear selection if navigating back to root messages route on mobile
  useEffect(() => {
    if (!conversationId && !isDesktop) {
      selectConversation(null);
    }
  }, [conversationId, isDesktop, selectConversation]);

  const handleSelectConversation = (id) => {
    navigate(buildPath(ROUTES.MESSAGES_CONVERSATION, { conversationId: id }));
  };

  // Mobile layout (Single Pane)
  if (!isDesktop) {
    if (conversationId) {
      // Chat view
      return (
        <div style={{ height: '100dvh', width: '100vw', backgroundColor: 'var(--color-background)' }}>
          <ChatWindow conversationId={conversationId} />
        </div>
      );
    } else {
      // List view
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <ConversationList onSelectConversation={handleSelectConversation} />
        </motion.div>
      );
    }
  }

  // Desktop layout (Single Pane Flow)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        margin: '0 auto',
        width: '100%',
        height: 'calc(100dvh - 64px - 40px)',
        border: '1px solid var(--color-surface-container-high)',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface)',
        marginTop: '20px'
      }}
    >
      {conversationId ? (
        <div style={{ flex: 1, backgroundColor: 'var(--color-background)' }}>
          <ChatWindow conversationId={conversationId} />
        </div>
      ) : (
        <div style={{ flex: 1, backgroundColor: 'var(--color-surface)' }}>
          <ConversationList onSelectConversation={handleSelectConversation} />
        </div>
      )}
    </motion.div>
  );
}
