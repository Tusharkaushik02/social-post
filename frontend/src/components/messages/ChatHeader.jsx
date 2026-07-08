import { motion } from 'framer-motion';
import { IoArrowBackOutline, IoCallOutline, IoVideocamOutline, IoInformationCircleOutline } from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import OnlineIndicator from './OnlineIndicator';
import { useOnlineStore } from '@/stores/useOnlineStore';

export default function ChatHeader({ conversation, partner, onBack }) {
  const displayName = partner?.displayName || partner?.username || 'Unknown';
  const { isOnline } = useOnlineStore();
  
  const isUserOnline = partner?._id ? isOnline(partner._id) : false;

  return (
    <div className="chat-header-glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px',
            marginLeft: '-8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--color-on-surface)'
          }}
        >
          <IoArrowBackOutline size={24} />
        </button>

        <div style={{ position: 'relative' }}>
          <div style={{ width: '40px', height: '40px' }}>
            <Avatar 
              src={partner.avatar} 
              fallbackName={displayName} 
              alt={displayName} 
              size="sm"
            />
          </div>
          {isUserOnline && <OnlineIndicator size={10} />}
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, lineHeight: 1 }}>
            {displayName}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '4px 0 0 0' }}>
            {isUserOnline ? 'Active now' : 'Active 5m ago'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            color: 'var(--color-primary)',
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
          onClick={() => { /* TODO: Voice call */ }}
        >
          <IoCallOutline size={22} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            color: 'var(--color-primary)',
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
          onClick={() => { /* TODO: Video call */ }}
        >
          <IoVideocamOutline size={24} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            color: 'var(--color-primary)',
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
          onClick={() => { /* TODO: Info panel */ }}
        >
          <IoInformationCircleOutline size={24} />
        </motion.button>
      </div>
    </div>
  );
}
