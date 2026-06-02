import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import FeedLayout from '@/components/layout/FeedLayout';
import PostCard from '@/components/post/PostCard';
import EmptyState from '@/components/common/EmptyState';
import Input from '@/components/ui/Input';
import { mockPosts } from '@/data/mockData';
import { usePostStore } from '@/stores/usePostStore';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    if (!posts.length) fetchPosts();
  }, [fetchPosts, posts.length]);

  const sourcePosts = posts.length ? posts : mockPosts;
  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sourcePosts;
    return sourcePosts.filter((post) => {
      const haystack = [
        post.caption,
        post.user?.username,
        post.user?.displayName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [query, sourcePosts]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  return (
    <FeedLayout title="Explore" subtitle="Discover people, posts, and topics">
      <form onSubmit={handleSubmit} className="mb-5">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts, people, or captions"
          leftIcon={<IoSearchOutline size={18} />}
          aria-label="Search explore"
        />
      </form>

      {filteredPosts.length ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoSearchOutline />}
          title="No matches found"
          description="Try a different username, topic, or caption."
        />
      )}
    </FeedLayout>
  );
}
