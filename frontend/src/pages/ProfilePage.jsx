import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { useAuth } from '@/hooks/useAuth';
import { formatCount } from '@/lib/utils';
import { usePostStore } from '@/stores/usePostStore';
import { useMessageStore } from '@/stores/useMessageStore';
import { usersApi } from '@/api/users.api';
import { ROUTES, buildPath } from '@/router/routes';
import EditProfileModal from '@/components/profile/EditProfileModal';

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

/**
 * Normalize backend user profile fields to what the UI expects.
 * Backend model: displayname, avatarUrl
 * UI expects: displayName, avatar
 */
function normalizeProfile(payload) {
  const raw = payload?.user || payload || {};
  return {
    ...raw,
    displayName: raw.displayName || raw.displayname || raw.username || '',
    avatar: raw.avatar || raw.avatarUrl || '',
    followersCount: payload?.followersCount ?? raw.followersCount ?? raw.followers?.length ?? 0,
    followingCount: payload?.followingCount ?? raw.followingCount ?? raw.following?.length ?? 0,
    isFollowing: Boolean(payload?.isFollowing ?? raw.isFollowing),
    joinedAt: raw.joinedAt || raw.createdAt || null,
  };
}

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { profilePosts, isLoading, fetchPostsByUser } = usePostStore();
  const { createConversation } = useMessageStore();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setProfileLoading(true);
      try {
        const { data } = await usersApi.getProfile(username);
        if (!active) return;
        const nextProfile = normalizeProfile(data);
        setProfile(nextProfile);
        setIsFollowing(Boolean(nextProfile.isFollowing));
      } catch {
        if (!active) return;
        // No mock fallback — show minimal data from URL
        setProfile({
          _id: `profile-${username}`,
          username,
          displayName: username,
          bio: '',
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          isFollowing: false,
          joinedAt: null,
        });
      } finally {
        if (active) setProfileLoading(false);
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
      { label: 'Followers', value: profile?.followersCount || 0 },
      { label: 'Following', value: profile?.followingCount || 0 },
    ],
    [profile, profilePosts.length]
  );

  const visiblePosts = useMemo(() => {
    if (activeTab === 'saved') return profilePosts.filter((post) => post.isSaved);
    if (activeTab === 'likes') return profilePosts.filter((post) => post.isLiked);
    return profilePosts;
  }, [activeTab, profilePosts]);

  const handleFollow = async () => {
    if (!profile?._id || isFollowPending) return;

    const next = !isFollowing;
    const previousFollowing = isFollowing;
    const previousFollowersCount = profile.followersCount || 0;

    setIsFollowPending(true);
    setIsFollowing(next);
    setProfile((value) =>
      value
        ? {
            ...value,
            isFollowing: next,
            followersCount: Math.max(0, (value.followersCount || 0) + (next ? 1 : -1)),
          }
        : value
    );

    try {
      const { data } = next
        ? await usersApi.follow(profile._id)
        : await usersApi.unfollow(profile._id);
      const confirmedFollowing = Boolean(data.following);

      setIsFollowing(confirmedFollowing);
      setProfile((value) =>
        value
          ? {
              ...value,
              isFollowing: confirmedFollowing,
              followersCount: data.followersCount ?? value.followersCount,
            }
          : value
      );
      toast.success(confirmedFollowing ? 'Following user' : 'Unfollowed user');
    } catch {
      setIsFollowing(previousFollowing);
      setProfile((value) =>
        value
          ? {
              ...value,
              isFollowing: previousFollowing,
              followersCount: previousFollowersCount,
            }
          : value
      );
      toast.error('Could not update follow status');
    } finally {
      setIsFollowPending(false);
    }
  };

  const handleMessage = async () => {
    if (!profile?._id) return;
    try {
      const conversation = await createConversation(profile._id);
      navigate(buildPath(ROUTES.MESSAGES_CONVERSATION, { conversationId: conversation._id }));
    } catch (error) {
      toast.error('Could not start conversation');
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
    <>
    <FeedLayout>
      {/* Profile Card */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          border: '0.5px solid rgba(207, 196, 197, 0.3)',
          background: 'var(--color-surface-container-lowest)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Cover area */}
        <div className="profile-cover">
          <div className="profile-cover-fade" />
        </div>

        <div style={{ padding: '0 20px 24px' }}>
          {/* Avatar + Name + Actions */}
          <div style={{ marginTop: '-48px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div className="profile-avatar-wrapper" style={{ marginTop: 0, marginLeft: 0 }}>
                <Avatar
                  src={profile?.avatar}
                  alt={profile?.displayName || username}
                  fallbackName={profile?.displayName || username}
                  size="xl"
                  className="profile-avatar-lg"
                />
                {profile?.verified && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-background)',
                    padding: '2px',
                  }}>
                    <IoCheckmarkCircle style={{ color: 'var(--color-secondary)' }} size={18} />
                  </div>
                )}
              </div>
              <div style={{ paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-on-surface)',
                  }}>
                    {profile?.displayName || username}
                  </h1>
                </div>
                <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>@{username}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {isOwnProfile ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <ProtectedAction onAction={handleFollow}>
                    <Button
                      type="button"
                      variant={isFollowing ? 'secondary' : 'primary'}
                      disabled={isFollowPending}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </ProtectedAction>
                  <ProtectedAction onAction={handleMessage}>
                    <Button
                      type="button"
                      variant="secondary"
                    >
                      Message
                    </Button>
                  </ProtectedAction>
                </>
              )}
              <Button
                type="button"
                variant="secondary"
                leftIcon={<IoShareOutline size={17} />}
                onClick={handleShareProfile}
                aria-label="Share profile"
              >
                Share
              </Button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-body-md" style={{
            marginTop: '20px',
            maxWidth: '36rem',
            lineHeight: '1.6',
            color: 'var(--color-on-surface)',
          }}>
            {profile?.bio || 'No bio yet.'}
          </p>

          {/* Join date */}
          <div className="text-label-md" style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-on-surface-variant)',
          }}>
            <IoCalendarOutline size={15} />
            {formatJoinDate(profile?.joinedAt)}
          </div>

          {/* Stats */}
          <dl className="profile-stats" style={{ marginTop: '20px' }}>
            {stats.map((item) => (
              <div
                key={item.label}
                className="profile-stat"
              >
                <dd className="profile-stat-value">
                  {formatCount(item.value)}
                </dd>
                <dt className="profile-stat-label">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </motion.section>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="profile-tabs"
        style={{ marginTop: '20px' }}
        role="tablist"
        aria-label="Profile content tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`profile-tab${activeTab === tab.id ? ' active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <tab.icon size={17} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="profile-tab-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  height: '2px',
                  width: '32px',
                  transform: 'translateX(-50%)',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Post Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        style={{ marginTop: '20px' }}
      >
        {isLoading ? (
          <div className="profile-grid">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="profile-grid-item skeleton-rect"
                style={{ animationName: 'shimmer' }}
              />
            ))}
          </div>
        ) : visiblePosts.length ? (
          <div className="profile-grid">
            {visiblePosts.map((post) => (
              <article
                key={post._id}
                className="profile-grid-item"
              >
                <img
                  src={post.image}
                  alt={post.caption || 'Profile post'}
                  loading="lazy"
                />
                <div className="profile-grid-overlay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="text-label-md" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      color: 'white',
                    }}>
                      <IoHeartOutline size={18} />
                      {formatCount(post.likes || 0)}
                    </span>
                  </div>
                </div>
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
      </motion.div>
    </FeedLayout>

    {/* Edit Profile Modal */}
    {isOwnProfile && (
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated) => {
          setProfile((prev) => prev ? {
            ...prev,
            displayName: updated.displayName || prev.displayName,
            avatar: updated.avatar || updated.avatarUrl || prev.avatar,
            avatarUrl: updated.avatarUrl || updated.avatar || prev.avatarUrl,
            bio: updated.bio ?? prev.bio,
          } : prev);
        }}
      />
    )}
  </>
  );
}
