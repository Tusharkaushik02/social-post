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
import { cn } from '@/lib/utils';
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
        cn(
          'relative mx-auto flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-2xl text-zinc-500 transition-colors hover:text-zinc-100',
          isActive && 'text-zinc-100'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="mobile-active"
              className="absolute inset-1 rounded-2xl bg-zinc-800/80"
            />
          )}
          <item.icon size={21} className="relative z-10" />
          <span className="relative z-10 text-[10px] font-semibold leading-none">
            {item.label}
          </span>
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/86 backdrop-blur-2xl md:hidden">
      <div className="mx-auto grid h-[68px] max-w-md grid-cols-5 items-center px-2 pb-[env(safe-area-inset-bottom)]">
        {mobileItems.slice(0, 2).map((item) => (
          <MobileLink key={item.label} item={item} />
        ))}

        <button
          type="button"
          onClick={() => (isAuthenticated ? openCreatePostModal() : openAuthModal('login'))}
          aria-label="Create post"
          className="mx-auto flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-2xl text-zinc-100"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white shadow-[0_16px_40px_-22px_rgba(139,92,246,1)]">
            <IoAddOutline size={23} />
          </span>
        </button>

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
            className="mx-auto flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-2xl text-zinc-500 transition-colors hover:text-zinc-100"
          >
            <IoPersonOutline size={21} />
            <span className="text-[10px] font-semibold leading-none">Profile</span>
          </button>
        )}
      </div>
    </nav>
  );
}
