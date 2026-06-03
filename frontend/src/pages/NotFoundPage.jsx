/**
 * NotFoundPage — 404 Error Page
 *
 * Catch-all page for unmatched routes.
 * Features a friendly message with floating animation and
 * a link back to the home feed.
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHomeOutline } from 'react-icons/io5';
import { ROUTES } from '@/router/routes';
import ContentColumn from '@/components/layout/ContentColumn';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <ContentColumn>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          minHeight: '60vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Floating 404 */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="not-found-404"
          style={{ marginBottom: '24px', userSelect: 'none' }}
        >
          404
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-headline-lg"
          style={{ marginBottom: '12px', color: 'var(--color-on-surface)' }}
        >
          Page not found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="text-body-lg"
          style={{ marginBottom: '32px', maxWidth: '24rem', color: 'var(--color-on-surface-variant)' }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.36 }}
        >
          <Link to={ROUTES.HOME}>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<IoHomeOutline size={18} />}
            >
              Go back home
            </Button>
          </Link>
        </motion.div>

        {/* Subtle decorative glow */}
        <div style={{
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: -10,
          height: '256px',
          width: '256px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 0, 0, 0.03)',
          filter: 'blur(48px)',
        }} />
      </motion.div>
    </ContentColumn>
  );
}
