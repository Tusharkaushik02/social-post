import { motion } from 'framer-motion';
import { IoChatbubblesOutline, IoChatbubbleOutline, IoSearchOutline } from 'react-icons/io5';

export default function EmptyChat({ variant = 'no-conversation' }) {
  const getProps = () => {
    switch (variant) {
      case 'no-messages':
        return {
          icon: IoChatbubbleOutline,
          title: "No messages yet",
          subtitle: "Send a message to start the conversation"
        };
      case 'no-results':
        return {
          icon: IoSearchOutline,
          title: "No results found",
          subtitle: "Try a different search term"
        };
      case 'no-conversation':
      default:
        return {
          icon: IoChatbubblesOutline,
          title: "Your Messages",
          subtitle: "Select a conversation or start a new one"
        };
    }
  };

  const { icon: Icon, title, subtitle } = getProps();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        padding: '24px'
      }}
    >
      <Icon size={48} color="var(--color-on-surface-variant)" style={{ opacity: 0.4, marginBottom: '16px' }} />
      <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 8px 0' }}>
        {title}
      </h3>
      <p style={{ fontSize: '15px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
        {subtitle}
      </p>
    </motion.div>
  );
}
