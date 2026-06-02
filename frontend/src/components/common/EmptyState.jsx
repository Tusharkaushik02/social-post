import { motion } from 'framer-motion';

export default function EmptyState({ title, description, icon, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800/80 bg-zinc-900/45 px-6 py-16 text-center backdrop-blur-xl"
    >
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-3xl text-violet-400 shadow-card">
          {icon}
        </div>
      )}
      <h3 className="text-headline-md text-zinc-100">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-body-md text-zinc-500">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
