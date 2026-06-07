import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IoCheckmarkCircle, IoEllipsisHorizontal, IoHeart } from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import PostActions from '@/components/post/PostActions';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime, truncate } from '@/lib/utils';
import { usePostStore } from '@/stores/usePostStore';

const MAX_CAPTION_PREVIEW = 180;

export default function PostCard({ post }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { likePost, savePost } = usePostStore();
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Backend uses 'User' (capital U) for the populated user reference
  const rawAuthor = post.User || post.user || {};
  const author = {
    ...rawAuthor,
    displayName: rawAuthor.displayName || rawAuthor.displayname || rawAuthor.username || 'Unknown user',
    avatar: rawAuthor.avatar || rawAuthor.avatarUrl || '',
    username: rawAuthor.username || 'unknown',
  };
  const authorName = author.displayName;
  const profilePath = `/profile/${author.username}`;
  const captionIsLong = post.caption && post.caption.length > MAX_CAPTION_PREVIEW;

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="post-card"
      style={{ flexDirection: 'row' }}
    >
      {/* Avatar */}
      <Link to={profilePath} aria-label={`${authorName}'s profile`} style={{ flexShrink: 0 }}>
        <Avatar src={author.avatar} alt={authorName} fallbackName={authorName} size="md" />
      </Link>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div className="post-header">
          <div className="post-author-info">
            <Link to={profilePath} className="post-author-name">
              {authorName}
            </Link>
            {author.verified && <IoCheckmarkCircle className="post-verified" size={14} />}
            <span style={{ flexShrink: 0, color: 'var(--color-outline)' }}>·</span>
            <span className="post-timestamp">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
          <button
            type="button"
            className="post-more-btn"
            aria-label="Post options"
          >
            <IoEllipsisHorizontal size={16} />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="post-caption">
            <p style={{ whiteSpace: 'pre-line' }}>
              {isExpanded || !captionIsLong
                ? post.caption
                : truncate(post.caption, MAX_CAPTION_PREVIEW)}
            </p>
            {captionIsLong && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="post-read-more"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Image */}
        {post.image && (
          <button
            type="button"
            onClick={handleImageTap}
            className="post-image-wrapper"
            aria-label="Post image, double tap to like"
          >
            <img
              src={post.image}
              alt={post.caption || `${authorName}'s post`}
              className="post-image"
              loading="lazy"
            />
            <div className="post-image-gradient" />

            <AnimatePresence>
              {showHeartPop && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.15, 1], opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IoHeart style={{ fontSize: '72px', color: '#ffffff', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}

        {/* Actions */}
        <PostActions
          post={post}
          onLike={handleLikeToggle}
          onComment={handleCommentOpen}
          onShare={handleShare}
          onSave={() => savePost(post._id)}
        />

        {/* Comment Input */}
        <div className="post-comment-row">
          <Avatar
            src={user?.avatar}
            fallbackName={user?.displayName || user?.username || 'G'}
            alt="My avatar"
            size="xs"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            aria-label="Add a comment"
            className="post-comment-input"
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}
