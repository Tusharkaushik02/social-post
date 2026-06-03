import { useEffect } from 'react';
import { IoAlertCircleOutline, IoImagesOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import PostCard from '@/components/post/PostCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

function PostCardSkeleton() {
  return (
    <article className="post-skeleton">
      <Skeleton variant="circular" width={40} height={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Skeleton variant="text" width="30%" height={14} />
          <Skeleton variant="text" width="15%" height={12} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton variant="text" width="90%" height={14} />
          <Skeleton variant="text" width="65%" height={14} />
        </div>
        <Skeleton variant="rectangular" style={{ aspectRatio: '16/10', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
          <Skeleton variant="text" width={60} height={14} />
          <Skeleton variant="text" width={60} height={14} />
          <Skeleton variant="text" width={40} height={14} />
        </div>
      </div>
    </article>
  );
}

export default function PostFeed({
  posts = [],
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  error,
  onRetry,
  emptyTitle = 'No posts yet',
  emptyDescription = 'When posts are available, they will show up here.',
}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    enabled: hasMore && !isLoading && !isFetchingMore,
    rootMargin: '360px',
  });

  useEffect(() => {
    if (isIntersecting) onLoadMore?.();
  }, [isIntersecting, onLoadMore]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} aria-label="Loading posts" role="status">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<IoAlertCircleOutline />}
        title="Unable to load posts"
        description={error}
        action={<Button type="button" variant="secondary" onClick={onRetry}>Try Again</Button>}
      />
    );
  }

  if (!posts.length) {
    return (
      <EmptyState
        icon={<IoImagesOutline />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <div ref={ref} style={{ minHeight: '32px' }} aria-hidden="true" />

      {isFetchingMore && <PostCardSkeleton />}

      {!hasMore && posts.length > 0 && (
        <p style={{
          padding: '32px 0',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.03em',
          color: 'var(--color-on-surface-variant)',
        }}>
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
}
