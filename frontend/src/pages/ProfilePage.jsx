import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  IoBookmarkOutline,
  IoCalendarOutline,
  IoCheckmarkCircle,
  IoGridOutline,
  IoHeartOutline,
  IoShareOutline,
} from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/common/EmptyState';
import FeedLayout from '@/components/layout/FeedLayout';
import ProtectedAction from '@/components/common/ProtectedAction';
import { mockUsers } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';
import { formatCount } from '@/lib/utils';
import { usePostStore } from '@/stores/usePostStore';
import { usersApi } from '@/api/users.api';

const tabs = [
  { id: 'posts', label: 'Posts', icon: IoGridOutline },
  { id: 'saved', label: 'Saved', icon: IoBookmarkOutline },
  { id: 'likes', label: 'Likes', icon: IoHeartOutline },
];

function formatJoinDate(date) {
  if (!date) return 'Joined recently';
  return `Joined ${new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })}`;
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { profilePosts, isLoading, fetchPostsByUser } = usePostStore();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data } = await usersApi.getProfile(username);
        if (!active) return;
        const nextProfile = data.user || data;
        setProfile(nextProfile);
        setIsFollowing(Boolean(nextProfile.isFollowing));
      } catch {
        if (!active) return;
        const fallback = mockUsers.find((item) => item.username === username) || {
          _id: `profile-${username}`,
          username,
          displayName: username,
          bio: 'Social Post member',
          followers: 0,
          following: 0,
          postsCount: 0,
          isFollowing: false,
          joinedAt: new Date().toISOString(),
        };
        setProfile(fallback);
        setIsFollowing(Boolean(fallback.isFollowing));
      }
    }

    loadProfile();
    fetchPostsByUser(username);
    return () => {
      active = false;
    };
  }, [fetchPostsByUser, username]);

  const stats = useMemo(
    () => [
      { label: 'Posts', value: profilePosts.length || profile?.postsCount || 0 },
      { label: 'Followers', value: profile?.followers || 0 },
      { label: 'Following', value: profile?.following || 0 },
    ],
    [profile, profilePosts.length]
  );

  const visiblePosts = useMemo(() => {
    if (activeTab === 'saved') return profilePosts.filter((post) => post.isSaved);
    if (activeTab === 'likes') return profilePosts.filter((post) => post.isLiked);
    return profilePosts;
  }, [activeTab, profilePosts]);

  const handleFollow = async () => {
    const next = !isFollowing;
    setIsFollowing(next);
    setProfile((value) =>
      value
        ? {
            ...value,
            followers: Math.max(0, (value.followers || 0) + (next ? 1 : -1)),
          }
        : value
    );

    try {
      if (next) await usersApi.follow(profile._id);
      else await usersApi.unfollow(profile._id);
      toast.success(next ? 'Following user' : 'Unfollowed user');
    } catch {
      toast.success(next ? 'Following user' : 'Unfollowed user');
    }
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied');
    } catch {
      toast.error('Could not copy profile link');
    }
  };

  return (
    <FeedLayout>
      <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/55 shadow-card backdrop-blur-xl">
        <div className="h-32 bg-gradient-to-br from-violet-500/35 via-zinc-900 to-zinc-950" />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar
                src={profile?.avatar}
                alt={profile?.displayName || username}
                fallbackName={profile?.displayName || username}
                size="xl"
                className="rounded-full ring-4 ring-zinc-950"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-[28px] font-bold leading-tight text-zinc-100">
                    {profile?.displayName || username}
                  </h1>
                  {profile?.verified && <IoCheckmarkCircle className="text-violet-400" size={21} />}
                </div>
                <p className="text-body-md text-zinc-500">@{username}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button type="button" variant="secondary">Edit Profile</Button>
              ) : (
                <ProtectedAction onAction={handleFollow}>
                  <Button type="button" variant={isFollowing ? 'secondary' : 'primary'}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </ProtectedAction>
              )}
              <Button
                type="button"
                variant="secondary"
                leftIcon={<IoShareOutline size={17} />}
                onClick={handleShareProfile}
              >
                Share
              </Button>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-body-md leading-relaxed text-zinc-300">
            {profile?.bio || 'No bio yet.'}
          </p>

          <div className="mt-4 flex items-center gap-2 text-label-md text-zinc-500">
            <IoCalendarOutline size={16} />
            {formatJoinDate(profile?.joinedAt)}
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-2">
            {stats.map((item) => (
              <div key={item.label} className="rounded-xl px-3 py-3 text-center">
                <dt className="text-label-sm text-zinc-500">{item.label}</dt>
                <dd className="mt-1 text-body-md font-bold text-zinc-100">
                  {formatCount(item.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-3 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-1 backdrop-blur-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl text-label-md font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-100'
            }`}
          >
            <tab.icon size={17} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="aspect-square animate-shimmer rounded-2xl bg-zinc-900" />
            ))}
          </div>
        ) : visiblePosts.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visiblePosts.map((post) => (
              <article
                key={post._id}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                <img
                  src={post.image}
                  alt={post.caption || 'Profile post'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<IoGridOutline />}
            title={`No ${activeTab} yet`}
            description="When there is something to show, it will appear in this grid."
          />
        )}
      </div>
    </FeedLayout>
  );
}
