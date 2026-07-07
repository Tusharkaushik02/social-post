import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import MessageStatus from './MessageStatus';

export default function MessageBubble({ message, isOwn, showAvatar, participantAvatar, participantName }) {
  const { content, type, status, createdAt } = message;

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '12px',
        maxWidth: '80%',
        marginLeft: isOwn ? 'auto' : '0',
        marginBottom: '4px'
      }}
    >
      {!isOwn && (
        <div style={{ width: '32px', height: '32px', flexShrink: 0, visibility: showAvatar ? 'visible' : 'hidden' }}>
          <Avatar 
            src={participantAvatar} 
            fallbackName={participantName} 
            alt={participantName} 
            size="sm"
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', maxWidth: '100%' }}>
        {type === 'image' && message.content.startsWith('http') && (
          <div style={{ 
            overflow: 'hidden', 
            borderRadius: '16px', 
            borderBottomRightRadius: isOwn ? '0' : '16px',
            borderBottomLeftRadius: isOwn ? '16px' : '0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '4px'
          }}>
            <img src={message.content} alt="Attachment" style={{ width: '100%', height: 'auto', maxHeight: '256px', objectFit: 'cover' }} />
          </div>
        )}
        
        {(!type || type === 'text') && (
          <div
            className={isOwn ? 'message-bubble-outgoing' : 'message-bubble-incoming'}
            style={{
              fontSize: '15px',
              lineHeight: '22px'
            }}
          >
            {content}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', margin: isOwn ? '0 4px 0 0' : '0 0 0 4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>
            {formatTime(createdAt)}
          </span>
          {isOwn && <MessageStatus status={status || 'sent'} />}
        </div>
      </div>
    </motion.div>
  );
}
