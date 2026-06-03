import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoBookmarkOutline, IoCompassOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import FeedLayout from '@/components/layout/FeedLayout';
import PostCard from '@/components/post/PostCard';
import PostFeed from '@/components/post/PostFeed';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/ui/Button';
import { usePostStore } from '@/stores/usePostStore';
import { ROUTES } from '@/router/routes';

export default function SavedPage() {
  const { savedPosts, isLoading, error, fetchSavedPosts } = usePostStore();

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  return (
    <FeedLayout
      title="Saved"
      subtitle="Posts you have bookmarked"
      actions={
        savedPosts.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-label-sm"
            style={{
              borderRadius: 'var(--radius-full)',
              border: '0.5px solid rgba(207, 196, 197, 0.3)',
              background: 'var(--color-surface-container-low)',
              padding: '4px 12px',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            {savedPosts.length} saved
          </motion.span>
        )
      }
    >
      {savedPosts.length ? (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {savedPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : isLoading || error ? (
        <PostFeed
          posts={savedPosts}
          isLoading={isLoading}
          error={error}
          onRetry={fetchSavedPosts}
          emptyTitle="No saved posts"
          emptyDescription="Save posts you want to revisit and they will appear here."
        />
      ) : (
        <EmptyState
          icon={<IoBookmarkOutline />}
          title="No saved posts yet"
          description="Tap the bookmark icon on any post to save it here for later."
          action={
            <Link to={ROUTES.EXPLORE}>
              <Button
                variant="secondary"
                leftIcon={<IoCompassOutline size={17} />}
              >
                Explore posts
              </Button>
            </Link>
          }
        />
      )}
    </FeedLayout>
  );
}
