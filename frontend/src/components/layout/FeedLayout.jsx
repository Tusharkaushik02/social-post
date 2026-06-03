import { motion } from 'framer-motion';

export default function FeedLayout({
  children,
  title,
  subtitle,
  actions,
  className = '',
}) {
  return (
    <section className={`feed-layout ${className}`}>
      {(title || subtitle || actions) && (
        <div className="feed-header">
          <div style={{ minWidth: 0 }}>
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="feed-title"
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="feed-subtitle"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ paddingBottom: 32 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
