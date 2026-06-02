import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IoAddOutline,
  IoChevronDownOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { APP_NAME } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';
import { buildPath, ROUTES } from '@/router/routes';
import { useUIStore } from '@/stores/useUIStore';

export default function Navbar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const openCreatePostModal = useUIStore((s) => s.openCreatePostModal);

  const displayName = user?.displayName || user?.username || 'Profile';
  const username = user?.username || 'me';
  const profilePath = buildPath(ROUTES.PROFILE, { username });

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `${ROUTES.EXPLORE}?q=${encodeURIComponent(trimmedQuery)}` : ROUTES.EXPLORE);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b-[0.5px] border-outline-variant/30">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-4"
          aria-label={`${APP_NAME} home`}
        >
          <span className="text-headline-md font-headline-md font-bold text-primary">
            SocialPost
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden flex-1 max-w-md mx-8 md:block"
        >
          <label className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-on-surface-variant text-[20px]">
              <IoSearchOutline size={18} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="h-10 w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
            />
          </label>
        </form>

        <div className="flex items-center gap-4 text-on-surface-variant">
          {isAuthenticated && (
            <button
              type="button"
              className="hover:opacity-70 transition-opacity active:scale-95 duration-200 flex items-center justify-center p-1.5"
              aria-label="Notifications"
            >
              <IoNotificationsOutline size={22} />
            </button>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
                Log In
              </Button>
              <Button type="button" variant="primary" size="sm" className="rounded-full px-4 py-1.5" onClick={() => openAuthModal('register')}>
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsProfileMenuOpen((value) => !value)}
                className="flex h-10 items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low py-1 pl-1 pr-2 text-on-surface hover:bg-surface-container-high transition-colors"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                <Avatar src={user?.avatar} fallbackName={displayName} alt={`${displayName} avatar`} size="sm" />
                <IoChevronDownOutline size={15} className="hidden text-on-surface-variant sm:block" />
              </motion.button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    role="menu"
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-md border border-outline-variant/30 bg-surface-container-lowest p-1 shadow-elevated backdrop-blur-xl"
                  >
                    <Link to={profilePath} role="menuitem" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 rounded-sm px-3 py-3 text-body-md text-on-surface transition-colors hover:bg-surface-container-low">
                      <IoPersonOutline size={18} />
                      Profile
                    </Link>
                    <Link to={ROUTES.SETTINGS} role="menuitem" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 rounded-sm px-3 py-3 text-body-md text-on-surface transition-colors hover:bg-surface-container-low">
                      <IoSettingsOutline size={18} />
                      Settings
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-body-md text-red-400 transition-colors hover:bg-red-500/10">
                      <IoLogOutOutline size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
