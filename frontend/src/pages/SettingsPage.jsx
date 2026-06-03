import { motion } from 'framer-motion';
import {
  IoLogOutOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoSyncOutline,
  IoPersonOutline,
  IoColorPaletteOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import FeedLayout from '@/components/layout/FeedLayout';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/stores/useThemeStore';

const themeOptions = [
  { value: 'dark', label: 'Dark', icon: IoMoonOutline },
  { value: 'light', label: 'Light', icon: IoSunnyOutline },
  { value: 'system', label: 'System', icon: IoSyncOutline },
];

const cardAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  return (
    <FeedLayout title="Settings" subtitle="Manage your account preferences">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Account Section */}
        <motion.section
          {...cardAnimation}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="settings-section"
        >
          <div className="settings-section-header">
            <div className="settings-icon-badge">
              <IoPersonOutline size={16} />
            </div>
            <h2 className="settings-section-title">Account</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <Avatar
                src={user?.avatar}
                fallbackName={user?.displayName || user?.username}
                alt={user?.displayName || user?.username}
                size="md"
              />
              <div style={{ minWidth: 0 }}>
                <p className="text-body-md truncate" style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                  {user?.displayName || user?.username}
                </p>
                <p className="text-label-md truncate" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div style={{ marginTop: '20px', borderTop: '0.5px solid rgba(207, 196, 197, 0.3)', paddingTop: '20px' }}>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-danger btn-md btn-full"
              aria-label="Log out of your account"
            >
              <IoLogOutOutline size={18} />
              Log out
            </button>
          </div>
        </motion.section>

        {/* Theme Section */}
        <motion.section
          {...cardAnimation}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="settings-section"
        >
          <div className="settings-section-header" style={{ marginBottom: '8px' }}>
            <div className="settings-icon-badge">
              <IoColorPaletteOutline size={16} />
            </div>
            <h2 className="settings-section-title">Theme</h2>
          </div>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginBottom: '20px' }}>
            Choose how SocialPost feels on your device.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                aria-label={`Set theme to ${option.label}`}
                aria-pressed={theme === option.value}
                className={`theme-btn${theme === option.value ? ' active' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '96px',
                  gap: '10px',
                }}
              >
                <option.icon size={24} />
                {option.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Privacy Section */}
        <motion.section
          {...cardAnimation}
          transition={{ duration: 0.3, delay: 0.19 }}
          className="settings-section"
        >
          <div className="settings-section-header">
            <div className="settings-icon-badge">
              <IoShieldCheckmarkOutline size={16} />
            </div>
            <h2 className="settings-section-title">Privacy</h2>
          </div>

          {/* Private account toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-container-low)',
            padding: '14px 16px',
          }}>
            <div>
              <p className="text-body-md" style={{ fontWeight: 500, color: 'var(--color-on-surface)' }}>Private account</p>
              <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                Only approved followers can see your posts
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked="false"
              aria-label="Toggle private account"
              className="toggle-switch"
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </motion.section>
      </div>
    </FeedLayout>
  );
}
