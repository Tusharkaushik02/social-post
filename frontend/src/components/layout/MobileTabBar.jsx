import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoAddOutline,
  IoBookmarkOutline,
  IoCompassOutline,
  IoHomeOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { buildPath, ROUTES } from '@/router/routes';
import { useUIStore } from '@/stores/useUIStore';

const mobileItems = [
  { label: 'Home', to: ROUTES.HOME, icon: IoHomeOutline, end: true },
  { label: 'Explore', to: ROUTES.EXPLORE, icon: IoCompassOutline },
  { label: 'Saved', to: ROUTES.SAVED, icon: IoBookmarkOutline },
];

function MobileLink({ item }) {
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
          <item.icon size={22} style={{ position: 'relative', zIndex: 10 }} />
          <span className="mobile-tab-label">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function MobileTabBar() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const openCreatePostModal = useUIStore((s) => s.openCreatePostModal);
  const username = user?.username || 'me';
  const profilePath = buildPath(ROUTES.PROFILE, { username });

  return (
    <nav
      className="mobile-tab-bar"
      aria-label="Mobile navigation"
    >
      <div className="mobile-tab-bar-inner">
        {mobileItems.slice(0, 2).map((item) => (
          <MobileLink key={item.label} item={item} />
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
          <MobileLink key={item.label} item={item} />
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
