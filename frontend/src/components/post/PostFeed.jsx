import { useEffect } from 'react';
import { IoAlertCircleOutline, IoImagesOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import PostCard from '@/components/post/PostCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

function PostCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={44} height={44} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="34%" height={14} />
          <Skeleton variant="text" width="22%" height={12} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" width="88%" height={14} />
        <Skeleton variant="text" width="62%" height={14} />
      </div>
      <Skeleton variant="rectangular" className="mt-4 aspect-[16/11] rounded-2xl" />
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
      <div className="space-y-6" aria-label="Loading posts">
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
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <div ref={ref} className="min-h-8" aria-hidden="true" />

      {isFetchingMore && <PostCardSkeleton />}

      {!hasMore && (
        <p className="py-8 text-center text-label-md text-zinc-600">
          You have reached the end.
        </p>
      )}
    </div>
  );
}
