import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoAddOutline,
  IoBookmarkOutline,
  IoCompassOutline,
  IoHomeOutline,
  IoPersonOutline,
  IoChatbubbleOutline,
} from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { buildPath, ROUTES } from '@/router/routes';
import { useUIStore } from '@/stores/useUIStore';
import { useUnreadStore } from '@/stores/useUnreadStore';

const baseItems = [
  { label: 'Home', to: ROUTES.HOME, icon: IoHomeOutline, end: true },
  { label: 'Explore', to: ROUTES.EXPLORE, icon: IoCompassOutline },
  { label: 'Saved', to: ROUTES.SAVED, icon: IoBookmarkOutline },
  { label: 'Messages', to: ROUTES.MESSAGES, icon: IoChatbubbleOutline },
];

export default function Sidebar() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const openCreatePostModal = useUIStore((s) => s.openCreatePostModal);
  const totalUnread = useUnreadStore((s) => s.getTotalUnread());
  
  const displayName = user?.displayName || user?.username || 'Guest';
  const username = user?.username || 'me';
  const profilePath = buildPath(ROUTES.PROFILE, { username });

  const navClass = ({ isActive }) =>
    `sidebar-link${isActive ? ' active' : ''}`;

  return (
    <aside
      className="sidebar"
      aria-label="Sidebar navigation"
    >
      <div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {baseItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.end} className={navClass}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="active-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} style={{ flexShrink: 0, transition: 'transform 0.2s' }} />
                  {item.label}
                  {item.label === 'Messages' && totalUnread > 0 && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        minWidth: 20,
                        height: 20,
                        borderRadius: 9999,
                        background: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        lineHeight: 1,
                      }}
                    >
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <NavLink to={profilePath} className={navClass}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="active-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <IoPersonOutline size={20} style={{ flexShrink: 0, transition: 'transform 0.2s' }} />
                  Profile
                </>
              )}
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="sidebar-link"
            >
              <IoPersonOutline size={20} style={{ flexShrink: 0 }} />
              Profile
            </button>
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        {/* New Post CTA */}
        <button
          type="button"
          onClick={() => (isAuthenticated ? openCreatePostModal() : openAuthModal('login'))}
          className="sidebar-new-post"
        >
          <IoAddOutline size={18} />
          New Post
        </button>

        {/* User Card */}
        <button
          type="button"
          onClick={() => (!isAuthenticated ? openAuthModal('login') : undefined)}
          className="sidebar-user-card"
        >
          <Avatar src={user?.avatar} fallbackName={displayName} alt={displayName} size="sm" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-on-surface)' }}>{displayName}</p>
            <p className="truncate" style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
              {isAuthenticated ? `@${username}` : 'Sign in to interact'}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
