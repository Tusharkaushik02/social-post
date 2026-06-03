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

  // Close menu on click outside
  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsProfileMenuOpen(false);
    }
    if (isProfileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isProfileMenuOpen]);

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
    <header className="navbar glass-nav">
      <nav
        className="navbar-inner"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="navbar-brand"
          aria-label={`${APP_NAME} home`}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--color-primary)', color: 'var(--color-on-primary)',
            fontSize: 14, fontWeight: 700,
          }}>
            S
          </div>
          <span className="navbar-brand-text">{APP_NAME}</span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="navbar-search"
        >
          <label style={{ position: 'relative', display: 'block' }}>
            <span className="navbar-search-icon">
              <IoSearchOutline size={16} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              aria-label="Search posts and users"
              className="navbar-search-input"
              style={{ paddingLeft: 36 }}
            />
          </label>
        </form>

        {/* Right Actions */}
        <div className="navbar-actions">
          {isAuthenticated && (
            <button
              type="button"
              className="navbar-icon-btn"
              aria-label="Notifications"
            >
              <IoNotificationsOutline size={20} />
            </button>
          )}

          {!isAuthenticated ? (
            <div className="navbar-actions">
              <Button type="button" variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
                Log In
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={() => openAuthModal('register')}>
                Sign Up
              </Button>
            </div>
          ) : (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileMenuOpen((value) => !value)}
                className="navbar-profile-btn"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                <Avatar src={user?.avatar} fallbackName={displayName} alt={`${displayName} avatar`} size="xs" />
                <IoChevronDownOutline
                  size={13}
                  style={{
                    color: 'var(--color-on-surface-variant)',
                    transition: 'transform 0.2s',
                    transform: isProfileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    display: 'none',
                  }}
                  className="navbar-chevron"
                />
              </motion.button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    role="menu"
                    className="dropdown-menu"
                  >
                    {/* User info header */}
                    <div className="dropdown-user-info">
                      <Avatar src={user?.avatar} fallbackName={displayName} alt={displayName} size="sm" />
                      <div style={{ minWidth: 0 }}>
                        <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-on-surface)' }}>{displayName}</p>
                        <p className="truncate" style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>@{username}</p>
                      </div>
                    </div>

                    <div className="dropdown-separator" />

                    <Link
                      to={profilePath}
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="dropdown-item"
                    >
                      <IoPersonOutline size={16} />
                      Profile
                    </Link>
                    <Link
                      to={ROUTES.SETTINGS}
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="dropdown-item"
                    >
                      <IoSettingsOutline size={16} />
                      Settings
                    </Link>

                    <div className="dropdown-separator" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="dropdown-item dropdown-item-danger"
                    >
                      <IoLogOutOutline size={16} />
                      Log out
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
