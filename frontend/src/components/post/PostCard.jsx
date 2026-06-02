import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IoCheckmarkCircle, IoEllipsisHorizontal, IoHeart } from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import PostActions from '@/components/post/PostActions';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/lib/utils';
import { usePostStore } from '@/stores/usePostStore';

export default function PostCard({ post }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { likePost, savePost } = usePostStore();
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const author = post.user || {};
  const authorName = author.displayName || author.username || 'Unknown user';
  const profilePath = `/profile/${author.username || 'unknown'}`;

  const popHeart = () => {
    setShowHeartPop(true);
    window.setTimeout(() => setShowHeartPop(false), 760);
  };

  const handleLikeToggle = () => {
    likePost(post._id);
    if (!post.isLiked) popHeart();
  };

  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isAuthenticated) {
        openAuthModal('login');
      } else {
        if (!post.isLiked) likePost(post._id);
        popHeart();
      }
    }
    setLastTap(now);
  };

  const handleCommentOpen = () => {
    toast('Comments are ready for the API hookup.');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posts/${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${authorName}'s post`, text: post.caption, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Post link copied');
      }
    } catch {
      toast.error('Could not share this post');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="w-full overflow-hidden bg-surface-container-lowest p-4 rounded-lg border-[0.5px] border-outline-variant/30 shadow-card flex gap-4"
    >
      <Link to={profilePath} aria-label={`${authorName}'s profile`} className="shrink-0">
        <Avatar src={author.avatar} alt={authorName} fallbackName={authorName} size="md" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Link to={profilePath} className="truncate text-body-md font-bold text-primary hover:underline">
              {author.username}
            </Link>
            {author.verified && <IoCheckmarkCircle className="shrink-0 text-secondary" size={16} />}
            <span className="text-on-surface-variant text-label-sm font-label-sm">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
          <button
            type="button"
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Post options"
          >
            <IoEllipsisHorizontal size={19} />
          </button>
        </div>

        {post.caption && (
          <p className="whitespace-pre-line text-body-md leading-relaxed text-on-surface mb-3">
            {post.caption}
          </p>
        )}

        {post.image && (
          <button
            type="button"
            onClick={handleImageTap}
            className="relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-black text-left sm:aspect-[16/11] mb-3"
            aria-label="Post image, double tap to like"
          >
            <img
              src={post.image}
              alt={post.caption || `${authorName}'s post`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.018]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent" />

            <AnimatePresence>
              {showHeartPop && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.74, ease: 'easeOut' }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <IoHeart className="text-8xl text-white drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}

        <PostActions
          post={post}
          onLike={handleLikeToggle}
          onComment={handleCommentOpen}
          onShare={handleShare}
          onSave={() => savePost(post._id)}
        />

        <div className="mt-4 flex gap-3 items-center pt-3 border-t-[0.5px] border-outline-variant/30">
          <Avatar
            src={user?.avatar}
            fallbackName={user?.displayName || user?.username || 'G'}
            alt="My avatar"
            size="sm"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-surface-container-low border-none rounded-full py-2 px-4 text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none"
              onClick={() => {
                if (!isAuthenticated) openAuthModal('login');
              }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
