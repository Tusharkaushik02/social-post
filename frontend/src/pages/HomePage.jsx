import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoSparklesOutline } from 'react-icons/io5';
import FeedLayout from '@/components/layout/FeedLayout';
import PostFeed from '@/components/post/PostFeed';
import { usePostStore } from '@/stores/usePostStore';

export default function HomePage() {
  const {
    posts,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    fetchPosts,
    fetchMorePosts,
  } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <FeedLayout
      title="Home"
      subtitle="The latest posts from your community"
      actions={
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="text-label-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: 'var(--radius-full)',
            border: '0.5px solid rgba(207, 196, 197, 0.3)',
            background: 'var(--color-surface-container-low)',
            padding: '6px 14px',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          <IoSparklesOutline style={{ color: 'var(--color-secondary)' }} size={14} />
          <span>Fresh feed</span>
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <PostFeed
          posts={posts}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          hasMore={hasMore}
          error={error}
          onLoadMore={fetchMorePosts}
          onRetry={fetchPosts}
        />
      </motion.div>
    </FeedLayout>
  );
}
