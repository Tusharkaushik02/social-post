import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import UnreadBadge from './UnreadBadge';
import OnlineIndicator from './OnlineIndicator';
import { useOnlineStore } from '@/stores/useOnlineStore';

export default function ConversationCard({ conversation, isActive, onClick }) {
  const { participants, lastMessage, unreadCount } = conversation;
  const partner = participants?.[0] || {};
  const displayName = partner.displayName || partner.username || 'Unknown';
  const previewText = lastMessage?.content || 'No messages yet';
  const isOnline = useOnlineStore((state) => state.isOnline(partner._id));
  
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`conversation-card ${isActive ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: '12px',
        width: '100%',
        textAlign: 'left',
        transition: 'background-color 0.2s',
        backgroundColor: isActive ? 'var(--color-surface-container)' : 'transparent',
        border: isActive ? '0.5px solid rgba(207, 196, 197, 0.3)' : '0.5px solid transparent',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: '48px', height: '48px' }}>
          <Avatar 
            src={partner.avatar} 
            fallbackName={displayName} 
            alt={displayName} 
            size="md"
          />
        </div>
        {isOnline && <OnlineIndicator />}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
          <span className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
            {displayName}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', flexShrink: 0, marginLeft: '8px' }}>
            {formatTime(lastMessage?.createdAt)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="truncate" style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
            {previewText}
          </p>
          {unreadCount > 0 && (
            <div style={{ marginLeft: '8px', flexShrink: 0 }}>
              <UnreadBadge count={unreadCount} />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
