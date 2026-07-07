import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import UnreadBadge from './UnreadBadge';
import { useOnlineStore } from '@/stores/useOnlineStore';
import { useAuthStore } from '@/stores/useAuthStore';
import OnlineIndicator from './OnlineIndicator';
/**
 * Format an ISO date string into a human-readable relative time.
 * Returns 'Just now', '5m', '1h', 'Yesterday', weekday name, or locale date.
 */
function formatRelativeTime(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;

  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  // Within the last 7 days — show weekday name
  if (diffDay < 7) {
    return date.toLocaleDateString([], { weekday: 'short' }); // Mon, Tue, etc.
  }

  // Older — show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ConversationItem({ conversation, isActive, onClick, index = 0 }) {
  const { participants, lastMessage, unreadCount } = conversation;
  const partner = participants?.[0] || {};
  const displayName = partner.displayName || partner.username || 'Unknown';
  const username = partner.username || '';
  const previewText = lastMessage?.content || 'No messages yet';
  const isOnline = useOnlineStore(s => s.isOnline(partner._id));
  const currentUserId = useAuthStore(s => s.user?._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        paddingLeft: isActive ? '16px' : '12px',
        borderRadius: '12px',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '72px',
        textAlign: 'left',
        position: 'relative',
        transition: 'background-color 0.2s',
        backgroundColor: isActive ? 'var(--color-surface-container)' : 'transparent',
        border: isActive ? '0.5px solid rgba(207, 196, 197, 0.3)' : '0.5px solid transparent',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Active accent bar */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '60%',
            borderRadius: '0 3px 3px 0',
            backgroundColor: 'var(--color-primary)',
          }}
        />
      )}

      {/* Avatar with online indicator */}
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

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, marginRight: '12px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: unreadCount > 0 ? 600 : 500,
                color: 'var(--color-on-surface)',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </span>
            {username && (
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--color-on-surface-variant)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                @{username}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <span
              style={{
                fontSize: '12px',
                color: unreadCount > 0 ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                fontWeight: unreadCount > 0 ? 600 : 400,
              }}
            >
              {formatRelativeTime(lastMessage?.createdAt)}
            </span>
            {unreadCount > 0 && (
              <UnreadBadge count={unreadCount} />
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: unreadCount > 0 ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
            fontWeight: unreadCount > 0 ? 500 : 400,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {lastMessage?.sender === currentUserId && (
            <span style={{ opacity: 0.7 }}>✓</span>
          )}
          {previewText}
        </p>
      </div>
    </motion.div>
  );
}
