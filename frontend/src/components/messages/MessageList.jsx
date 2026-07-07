import { useEffect, useRef } from 'react';
import { useMessageStore } from '@/stores/useMessageStore';
import MessageBubble from './MessageBubble';
import DateSeparator from './DateSeparator';
import SkeletonLoader from './SkeletonLoader';
import EmptyChat from './EmptyChat';

// helper to format date
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

const formatDateSeparator = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function MessageList({ conversationId, currentUserId, partner }) {
  const { messages, isLoadingMessages } = useMessageStore();
  const convMessages = messages[conversationId] || [];
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [convMessages.length]);

  if (isLoadingMessages) {
    return (
      <div style={{ flex: 1, padding: '24px', backgroundColor: 'rgba(249, 249, 254, 0.3)' }}>
        <SkeletonLoader variant="messages" count={6} />
      </div>
    );
  }

  if (convMessages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(249, 249, 254, 0.3)' }}>
        <EmptyChat variant="no-messages" />
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="message-area"
      style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'rgba(249, 249, 254, 0.3)' 
      }}
    >
      {convMessages.map((msg, index) => {
        const isOwn = msg.sender === currentUserId || msg.sender === 'current_user';
        const isLastInGroup = index === convMessages.length - 1 || convMessages[index + 1].sender !== msg.sender;
        
        const prevMsg = index > 0 ? convMessages[index - 1] : null;
        const showDateSeparator = !prevMsg || !isSameDay(msg.createdAt, prevMsg.createdAt);

        return (
          <div key={msg._id || msg.clientMessageId || `msg_${index}`} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
             {showDateSeparator && <DateSeparator date={formatDateSeparator(msg.createdAt)} />}
             <MessageBubble
               message={msg}
               isOwn={isOwn}
               showAvatar={!isOwn && isLastInGroup}
               participantAvatar={partner?.avatar}
               participantName={partner?.displayName || partner?.username}
             />
          </div>
        );
      })}
    </div>
  );
}
