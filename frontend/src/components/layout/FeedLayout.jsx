import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FeedLayout({
  children,
  title,
  subtitle,
  actions,
  className = '',
}) {
  return (
    <section className={cn('mx-auto w-full max-w-[640px] px-4 sm:px-0', className)}>
      {(title || subtitle || actions) && (
        <div className="mb-5 flex min-h-16 items-end justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="truncate text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary"
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <p className="mt-1 text-body-md text-on-surface-variant">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="pb-8"
      >
        {children}
      </motion.div>
    </section>
  );
}
