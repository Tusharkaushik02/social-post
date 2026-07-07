import { useState, useMemo, useEffect } from 'react';
import { useMessageStore } from '@/stores/useMessageStore';
import SearchBar from './SearchBar';
import ConversationItem from './ConversationItem';
import SkeletonLoader from './SkeletonLoader';
import EmptyMessages from './EmptyMessages';
import { IoPencilOutline } from 'react-icons/io5';

export default function ConversationList({ onSelectConversation }) {
  const { conversations, isLoadingConversations, fetchConversations } = useMessageStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) => {
        const partner = c.participants?.[0] || {};
        const displayName = (partner.displayName || '').toLowerCase();
        const username = (partner.username || '').toLowerCase();
        const lastMsg = (c.lastMessage?.content || '').toLowerCase();
        return displayName.includes(q) || username.includes(q) || lastMsg.includes(q);
      }
    );
  }, [conversations, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', marginTop: '16px', padding: '0 8px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)', margin: 0 }}>Messages</h2>
        <button
          style={{
            background: 'transparent',
            color: 'var(--color-on-surface-variant)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px', padding: '0 8px' }}>
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messages..." />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' }}>
        {isLoadingConversations ? (
          <SkeletonLoader variant="conversations" count={5} />
        ) : conversations.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <EmptyMessages variant="no-messages" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <EmptyMessages variant="no-results" />
          </div>
        ) : (
          filteredConversations.map((conv, index) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={false}
              onClick={() => onSelectConversation(conv._id)}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
