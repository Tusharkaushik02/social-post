import { useEffect } from 'react';
import FeedLayout from '@/components/layout/FeedLayout';
import PostCard from '@/components/post/PostCard';
import PostFeed from '@/components/post/PostFeed';
import { usePostStore } from '@/stores/usePostStore';

export default function SavedPage() {
  const { savedPosts, isLoading, error, fetchSavedPosts } = usePostStore();

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  return (
    <FeedLayout title="Saved" subtitle="Posts you have bookmarked">
      {savedPosts.length ? (
        <div className="space-y-6">
          {savedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <PostFeed
          posts={savedPosts}
          isLoading={isLoading}
          error={error}
          onRetry={fetchSavedPosts}
          emptyTitle="No saved posts"
          emptyDescription="Save posts you want to revisit and they will appear here."
        />
      )}
    </FeedLayout>
  );
}
