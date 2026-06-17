import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoSearchOutline, IoPersonOutline } from 'react-icons/io5';
import FeedLayout from '@/components/layout/FeedLayout';
import PostCard from '@/components/post/PostCard';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/common/EmptyState';
import { searchApi } from '@/api/search.api';
import { usePostStore } from '@/stores/usePostStore';

const filterPills = [
  { id: 'all', label: 'All' },
  { id: 'users', label: 'People' },
  { id: 'posts', label: 'Posts' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // For discovery mode (no search query)
  const { posts: feedPosts, fetchPosts } = usePostStore();

  useEffect(() => {
    if (!feedPosts.length) fetchPosts();
  }, [fetchPosts, feedPosts.length]);

  const performSearch = useCallback(async (term, type = 'all') => {
    if (!term.trim()) {
      setSearchResults({ users: [], posts: [] });
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const { data } = await searchApi.search(term.trim(), type);
      setSearchResults({
        users: data.users || [],
        posts: data.posts || [],
      });
    } catch (error) {
      console.error('[ExplorePage] Search error:', error.message);
      setSearchResults({ users: [], posts: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search when URL query changes (e.g., navigating from Navbar search)
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, activeFilter);
    }
  }, [initialQuery, performSearch, activeFilter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
    performSearch(trimmed, activeFilter);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    if (query.trim()) {
      performSearch(query.trim(), filterId);
    }
  };

  const showUsers = (activeFilter === 'all' || activeFilter === 'users') && searchResults.users.length > 0;
  const showPosts = (activeFilter === 'all' || activeFilter === 'posts');
  const displayPosts = hasSearched ? searchResults.posts : feedPosts;
  const noResults = hasSearched && searchResults.users.length === 0 && searchResults.posts.length === 0;

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
        aria-label="Filter search results"
      >
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === pill.id}
            onClick={() => handleFilterChange(pill.id)}
            className={`filter-pill${activeFilter === pill.id ? ' active' : ''}`}
          >
            {pill.label}
          </button>
        ))}
      </motion.div>

      {/* Loading state */}
      {isSearching && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-on-surface-variant)' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block', width: 24, height: 24, border: '2px solid var(--color-outline)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}
          />
          <p style={{ marginTop: '12px', fontSize: '14px' }}>Searching…</p>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && (
        <>
          {/* User Results */}
          {showUsers && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ marginBottom: '24px' }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-on-surface-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}>
                People
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '0.5px solid rgba(207, 196, 197, 0.3)',
                background: 'var(--color-surface-container-lowest)',
              }}>
                {searchResults.users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background 0.15s',
                    }}
                    className="search-user-item"
                  >
                    <Avatar
                      src={user.avatarUrl}
                      fallbackName={user.displayname || user.username}
                      alt={user.username}
                      size="md"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-on-surface)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {user.displayname || user.username}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: 'var(--color-on-surface-variant)',
                      }}>
                        @{user.username}
                        {user.followersCount > 0 && ` · ${user.followersCount} followers`}
                      </p>
                      {user.bio && (
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--color-outline)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Post Results */}
          {showPosts && displayPosts.length > 0 && (
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.12 }}
            >
              {hasSearched && (
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-on-surface-variant)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Posts
                </h3>
              )}
              {displayPosts.map((post, index) => (
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
          )}

          {/* No results */}
          {noResults && (
            <EmptyState
              icon={<IoSearchOutline />}
              title="No matches found"
              description="Try a different username, topic, or caption."
            />
          )}

          {/* Discovery mode — no query, no posts */}
          {!hasSearched && feedPosts.length === 0 && !isSearching && (
            <EmptyState
              icon={<IoSearchOutline />}
              title="Start exploring"
              description="Search for people or posts to discover new content."
            />
          )}
        </>
      )}
    </FeedLayout>
  );
}
