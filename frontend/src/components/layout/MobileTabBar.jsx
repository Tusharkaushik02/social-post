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
import { useAuth } from '@/hooks/useAuth';
import { buildPath, ROUTES } from '@/router/routes';
import { useUIStore } from '@/stores/useUIStore';
import { useUnreadStore } from '@/stores/useUnreadStore';

const mobileItems = [
  { label: 'Home', to: ROUTES.HOME, icon: IoHomeOutline, end: true },
  { label: 'Explore', to: ROUTES.EXPLORE, icon: IoCompassOutline },
  { label: 'Messages', to: ROUTES.MESSAGES, icon: IoChatbubbleOutline },
  { label: 'Saved', to: ROUTES.SAVED, icon: IoBookmarkOutline },
];

function MobileLink({ item, badge = 0 }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      aria-label={item.label}
      className={({ isActive }) =>
        `mobile-tab-link${isActive ? ' active' : ''}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="mobile-active"
              className="active-dot"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <div style={{ position: 'relative' }}>
            <item.icon size={22} style={{ position: 'relative', zIndex: 10 }} />
            {badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 9999,
                  background: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                  zIndex: 20
                }}
              >
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </div>
          <span className="mobile-tab-label">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function MobileTabBar() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const openCreatePostModal = useUIStore((s) => s.openCreatePostModal);
  const totalUnread = useUnreadStore((s) => s.getTotalUnread());
  const username = user?.username || 'me';
  const profilePath = buildPath(ROUTES.PROFILE, { username });

  return (
    <nav
      className="mobile-tab-bar"
      aria-label="Mobile navigation"
    >
      <div className="mobile-tab-bar-inner">
        {mobileItems.slice(0, 2).map((item) => (
          <MobileLink key={item.label} item={item} badge={item.label === 'Messages' ? totalUnread : 0} />
        ))}

        {/* Create Post — center button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => (isAuthenticated ? openCreatePostModal() : openAuthModal('login'))}
            aria-label="Create post"
            className="mobile-create-btn"
          >
            <IoAddOutline size={22} />
          </button>
        </div>

        {mobileItems.slice(2).map((item) => (
          <MobileLink key={item.label} item={item} badge={item.label === 'Messages' ? totalUnread : 0} />
        ))}

        {isAuthenticated ? (
          <MobileLink
            item={{
              label: 'Profile',
              to: profilePath,
              icon: IoPersonOutline,
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            aria-label="Profile"
            className="mobile-tab-link"
          >
            <IoPersonOutline size={22} />
            <span className="mobile-tab-label">Profile</span>
          </button>
        )}
      </div>
    </nav>
  );
}
