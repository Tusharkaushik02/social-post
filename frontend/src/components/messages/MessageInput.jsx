import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoAddOutline, IoHappyOutline, IoSendOutline } from 'react-icons/io5';
import { useMessageStore } from '@/stores/useMessageStore';

export default function MessageInput({ conversationId, recipientName, onSend }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage } = useMessageStore();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleSend = () => {
    if (text.trim()) {
      if (onSend) {
        onSend(text.trim());
      } else {
        sendMessage(conversationId, text.trim());
      }
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ padding: '8px 24px 32px 24px', position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: 'var(--color-background)' }}>
      <div 
        className="glass-input" 
        style={{ 
          maxWidth: '768px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '8px' 
        }}
      >
        <button
          style={{
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--color-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            flexShrink: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => { /* TODO: Attachment menu */ }}
        >
          <IoAddOutline size={20} />
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${recipientName || '...'}`}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '15px',
              padding: '10px 8px',
              maxHeight: '120px',
              overflowY: 'auto',
              color: 'var(--color-on-surface)'
            }}
            rows={1}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button
            style={{
              padding: '12px',
              borderRadius: '12px',
              color: 'var(--color-on-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => { /* TODO: Emoji picker */ }}
          >
            <IoHappyOutline size={20} />
          </button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!text.trim()}
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              opacity: text.trim() ? 1 : 0.7,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              border: 'none'
            }}
          >
            <IoSendOutline size={18} style={{ transform: 'translateX(2px)' }} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
