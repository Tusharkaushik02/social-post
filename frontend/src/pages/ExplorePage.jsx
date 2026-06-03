import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearchOutline } from 'react-icons/io5';
import FeedLayout from '@/components/layout/FeedLayout';
import PostCard from '@/components/post/PostCard';
import EmptyState from '@/components/common/EmptyState';
import Input from '@/components/ui/Input';
import { mockPosts } from '@/data/mockData';
import { usePostStore } from '@/stores/usePostStore';

const filterPills = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'recent', label: 'Recent' },
  { id: 'popular', label: 'Popular' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('all');
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
      {/* Search bar */}
      <motion.form
        onSubmit={handleSubmit}
        style={{ marginBottom: '16px' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-on-surface-variant)',
              pointerEvents: 'none',
              display: 'flex',
            }}
          >
            <IoSearchOutline size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts, people, or captions…"
            aria-label="Search explore"
            className="explore-search"
          />
        </div>
      </motion.form>

      {/* Filter pills */}
      <motion.div
        className="hide-scroll"
        style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
        role="tablist"
        aria-label="Filter posts"
      >
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === pill.id}
            onClick={() => setActiveFilter(pill.id)}
            className={`filter-pill${activeFilter === pill.id ? ' active' : ''}`}
          >
            {pill.label}
          </button>
        ))}
      </motion.div>

      {/* Post list */}
      {filteredPosts.length ? (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.12 }}
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
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
