import { useEffect } from 'react';
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
    <FeedLayout title="Home" subtitle="The latest posts from your community">
      <PostFeed
        posts={posts}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        hasMore={hasMore}
        error={error}
        onLoadMore={fetchMorePosts}
        onRetry={fetchPosts}
      />
    </FeedLayout>
  );
}
