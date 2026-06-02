import { IoLogOutOutline, IoMoonOutline, IoSunnyOutline, IoSyncOutline } from 'react-icons/io5';
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
      <div className="space-y-5">
        <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-5 shadow-card backdrop-blur-xl">
          <h2 className="text-headline-md text-zinc-100">Account</h2>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                src={user?.avatar}
                fallbackName={user?.displayName || user?.username}
                alt={user?.displayName || user?.username}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-body-md font-semibold text-zinc-100">
                  {user?.displayName || user?.username}
                </p>
                <p className="truncate text-label-md text-zinc-500">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<IoLogOutOutline size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-5 shadow-card backdrop-blur-xl">
          <h2 className="text-headline-md text-zinc-100">Theme</h2>
          <p className="mt-1 text-body-md text-zinc-500">
            Choose how SocialPost feels on your device.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-label-md font-semibold transition-colors ${
                  theme === option.value
                    ? 'border-violet-500 bg-violet-500/15 text-violet-200'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100'
                }`}
              >
                <option.icon size={22} />
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </FeedLayout>
  );
}
