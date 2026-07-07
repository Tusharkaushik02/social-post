import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES, buildPath } from '@/router/routes';
import { useMessageStore } from '@/stores/useMessageStore';
import ConversationList from '@/components/messages/ConversationList';

export default function MessagesPage() {
  const navigate = useNavigate();
  const { selectConversation } = useMessageStore();

  // Clear selection when returning to list
  useEffect(() => {
    selectConversation(null);
  }, [selectConversation]);

  const handleSelectConversation = (id) => {
    navigate(buildPath(ROUTES.MESSAGES_CONVERSATION, { conversationId: id }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        height: 'calc(100dvh - 64px - 72px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ConversationList onSelectConversation={handleSelectConversation} />
    </motion.div>
  );
}
