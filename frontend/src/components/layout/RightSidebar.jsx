import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

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
    <aside className="sticky top-24 hidden h-[calc(100dvh-6rem)] w-[320px] shrink-0 flex-col gap-6 xl:flex">
      {/* Trending Block */}
      <div className="rounded-xl border-[0.5px] border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card">
        <h3 className="text-headline-md font-headline-md text-primary mb-4">Trending</h3>
        <div className="flex flex-col gap-4">
          {trendingData.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="text-label-sm font-label-sm text-on-surface-variant mb-0.5">{item.category}</div>
              <div className="text-label-md font-label-md font-bold text-primary group-hover:underline">
                {item.tag}
              </div>
              <div className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">{item.posts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Block */}
      <div className="rounded-xl border-[0.5px] border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card">
        <h3 className="text-headline-md font-headline-md text-primary mb-4">Who to follow</h3>
        <div className="flex flex-col gap-4">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-label-md font-label-md font-bold text-primary hover:underline cursor-pointer truncate">
                    {user.username}
                  </div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant truncate">
                    {user.role}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant={user.isFollowing ? 'secondary' : 'primary'}
                size="sm"
                className="h-8 rounded-full px-3.5"
                onClick={() => handleFollowToggle(user.id)}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-2 text-label-sm font-label-sm text-on-surface-variant">
        <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
          <a className="hover:underline" href="#">About</a>
          <a className="hover:underline" href="#">Help</a>
          <a className="hover:underline" href="#">Terms</a>
          <a className="hover:underline" href="#">Privacy</a>
        </div>
        <p>© 2026 Aura Social</p>
      </footer>
    </aside>
  );
}
