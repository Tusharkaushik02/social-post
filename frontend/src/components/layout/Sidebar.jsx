import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoAddOutline,
  IoBookmarkOutline,
  IoCompassOutline,
  IoHomeOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { buildPath, ROUTES } from '@/router/routes';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';

const baseItems = [
  { label: 'Home', to: ROUTES.HOME, icon: IoHomeOutline, end: true },
  { label: 'Explore', to: ROUTES.EXPLORE, icon: IoCompassOutline },
  { label: 'Saved', to: ROUTES.SAVED, icon: IoBookmarkOutline },
];

export default function Sidebar() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const openCreatePostModal = useUIStore((s) => s.openCreatePostModal);
  const displayName = user?.displayName || user?.username || 'Guest';
  const username = user?.username || 'me';
  const profilePath = buildPath(ROUTES.PROFILE, { username });

  const navClass = ({ isActive }) =>
    cn(
      'group relative flex h-12 items-center gap-4 rounded-sm px-4 text-body-md font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-on-surface',
      isActive && 'bg-surface-container-high text-primary font-bold'
    );

  return (
    <aside className="sticky top-24 hidden h-[calc(100dvh-6rem)] w-[240px] shrink-0 flex-col justify-between lg:flex">
      <div>
        <nav className="space-y-1.5" aria-label="Primary navigation">
          {baseItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.end} className={navClass}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-y-2 left-1 w-1 rounded-full bg-secondary"
                    />
                  )}
                  <item.icon size={22} className="transition-transform group-hover:scale-105" />
                  {item.label}
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
                      className="absolute inset-y-2 left-1 w-1 rounded-full bg-secondary"
                    />
                  )}
                  <IoPersonOutline size={22} className="transition-transform group-hover:scale-105" />
                  Profile
                </>
              )}
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex h-12 w-full items-center gap-4 rounded-sm px-4 text-left text-body-md font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-on-surface"
            >
              <IoPersonOutline size={22} />
              Profile
            </button>
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-4 pb-8">
        <Button
          type="button"
          variant="primary"
          fullWidth
          leftIcon={<IoAddOutline size={18} />}
          onClick={() => (isAuthenticated ? openCreatePostModal() : openAuthModal('login'))}
          className="h-12 justify-center font-label-md text-label-md rounded-full"
        >
          New Post
        </Button>

        <button
          type="button"
          onClick={() => (!isAuthenticated ? openAuthModal('login') : undefined)}
          className="flex items-center gap-3 rounded-sm border-[0.5px] border-outline-variant/30 bg-surface-container-lowest p-3 text-left shadow-card hover:bg-surface-container-low transition-colors w-full"
        >
          <Avatar src={user?.avatar} fallbackName={displayName} alt={displayName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-md font-semibold text-primary">{displayName}</p>
            <p className="truncate text-label-sm text-on-surface-variant">
              {isAuthenticated ? `@${username}` : 'Sign in to interact'}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
