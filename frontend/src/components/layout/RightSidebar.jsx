import { useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME } from '@/config/constants';

const trendingData = [
  { category: 'Design • Trending', tag: '#Glassmorphism2026', posts: '15.4k posts' },
  { category: 'Technology • Trending', tag: 'Tailwind v4', posts: '8,230 posts' },
  { category: 'Photography • Trending', tag: 'StreetPhotography', posts: '5,102 posts' },
];

const initialSuggestions = [
  {
    id: 'alex_ui',
    username: 'alex_ui',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    isFollowing: false,
  },
  {
    id: 'photo_journal',
    username: 'photo_journal',
    role: 'Visuals',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    isFollowing: false,
  },
];

export default function RightSidebar() {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const handleFollowToggle = (id) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isFollowing;
          toast.success(nextState ? `Following @${item.username}` : `Unfollowed @${item.username}`);
          return { ...item, isFollowing: nextState };
        }
        return item;
      })
    );
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
          {suggestions.map((user) => (
            <div key={user.id} className="suggestion-item">
              <div className="suggestion-user">
                <img
                  src={user.avatar}
                  alt={`${user.username}'s avatar`}
                  className="suggestion-avatar"
                  loading="lazy"
                />
                <div style={{ minWidth: 0 }}>
                  <div className="suggestion-username">{user.username}</div>
                  <div className="suggestion-role">{user.role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFollowToggle(user.id)}
                className={`follow-btn${user.isFollowing ? ' following' : ''}`}
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
