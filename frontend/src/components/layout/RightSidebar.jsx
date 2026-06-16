import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { APP_NAME } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/api/users.api';

const trendingData = [
  { category: 'Design • Trending', tag: '#Glassmorphism2026', posts: '15.4k posts' },
  { category: 'Technology • Trending', tag: 'Tailwind v4', posts: '8,230 posts' },
  { category: 'Photography • Trending', tag: 'StreetPhotography', posts: '5,102 posts' },
];

function normalizeSuggestion(user) {
  return {
    id: user._id || user.id,
    username: user.username,
    displayName: user.displayName || user.displayname || user.username,
    role: user.bio || `${user.followersCount || 0} followers`,
    avatar: user.avatar || user.avatarUrl || '',
    isFollowing: Boolean(user.isFollowing),
  };
}

export default function RightSidebar() {
  const { isAuthenticated } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [pendingFollowId, setPendingFollowId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadSuggestions() {
      if (!isAuthenticated) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const { data } = await usersApi.getSuggestions(3);
        if (!active) return;
        const users = Array.isArray(data.users) ? data.users : [];
        setSuggestions(users.map(normalizeSuggestion));
      } catch {
        if (active) setSuggestions([]);
      } finally {
        if (active) setIsLoadingSuggestions(false);
      }
    }

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleFollowToggle = async (id) => {
    const target = suggestions.find((item) => item.id === id);
    if (!target || pendingFollowId) return;

    const nextState = !target.isFollowing;
    setPendingFollowId(id);
    setSuggestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFollowing: nextState } : item))
    );

    try {
      const { data } = nextState
        ? await usersApi.follow(id)
        : await usersApi.unfollow(id);
      const confirmedFollowing = Boolean(data.following);

      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFollowing: confirmedFollowing } : item
        )
      );
      toast.success(confirmedFollowing ? `Following @${target.username}` : `Unfollowed @${target.username}`);
    } catch {
      setSuggestions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFollowing: target.isFollowing } : item))
      );
      toast.error(`Could not update @${target.username}`);
    } finally {
      setPendingFollowId(null);
    }
  };

  return (
    <aside
      className="right-sidebar"
      aria-label="Sidebar"
    >
      {/* Trending Block */}
      <div className="right-sidebar-card">
        <h3 className="right-sidebar-title">Trending</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {trendingData.map((item, index) => (
            <div
              key={index}
              className="trending-item"
              role="link"
              tabIndex={0}
            >
              <div className="trending-category">{item.category}</div>
              <div className="trending-tag">{item.tag}</div>
              <div className="trending-posts">{item.posts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users Block */}
      <div className="right-sidebar-card">
        <h3 className="right-sidebar-title">Who to follow</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isLoadingSuggestions && (
            <p className="suggestion-role">Loading suggestions...</p>
          )}
          {!isLoadingSuggestions && suggestions.length === 0 && (
            <p className="suggestion-role">
              {isAuthenticated ? 'No suggestions right now.' : 'Sign in to see suggestions.'}
            </p>
          )}
          {suggestions.map((user) => (
            <div key={user.id} className="suggestion-item">
              <div className="suggestion-user">
                <Link to={`/profile/${user.username}`} aria-label={`${user.username}'s profile`}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.username}'s avatar`}
                      className="suggestion-avatar"
                      loading="lazy"
                    />
                  ) : (
                    <div className="suggestion-avatar" aria-hidden="true" />
                  )}
                </Link>
                <div style={{ minWidth: 0 }}>
                  <Link to={`/profile/${user.username}`} className="suggestion-username">
                    {user.displayName}
                  </Link>
                  <div className="suggestion-role">{user.role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFollowToggle(user.id)}
                className={`follow-btn${user.isFollowing ? ' following' : ''}`}
                disabled={pendingFollowId === user.id}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="sidebar-footer-links">
        <a href="#">About</a>
        <a href="#">Help</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <p style={{ width: '100%', marginTop: 4 }}>© 2026 {APP_NAME}</p>
      </footer>
    </aside>
  );
}
