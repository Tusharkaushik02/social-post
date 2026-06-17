import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  IoLinkOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { usePostStore } from '@/stores/usePostStore';
import { postsApi } from '@/api/posts.api';

export default function PostOptionsMenu({ post, isOpen, onClose }) {
  const menuRef = useRef(null);
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rawAuthor = post.User || post.user || {};
  const isOwner = user && (
    rawAuthor._id === user._id ||
    rawAuthor._id?.toString() === user._id?.toString() ||
    rawAuthor.username === user.username
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
        setShowConfirm(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event) {
      if (event.key === 'Escape') {
        onClose();
        setShowConfirm(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/posts/${post._id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Post link copied');
    } catch {
      toast.error('Could not copy link');
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await postsApi.delete(post._id);

      // Remove from all store arrays
      const { posts, profilePosts, savedPosts } = usePostStore.getState();
      usePostStore.setState({
        posts: posts.filter((p) => p._id !== post._id),
        profilePosts: profilePosts.filter((p) => p._id !== post._id),
        savedPosts: savedPosts.filter((p) => p._id !== post._id),
      });

      toast.success('Post deleted');
      onClose();
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to delete post';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          role="menu"
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            minWidth: '180px',
            zIndex: 50,
          }}
        >
          {/* Copy link */}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="dropdown-item"
          >
            <IoLinkOutline size={16} />
            Copy link
          </button>

          {/* Delete (only for post owner) */}
          {isOwner && (
            <>
              <div className="dropdown-separator" />
              <button
                type="button"
                role="menuitem"
                onClick={handleDelete}
                disabled={isDeleting}
                className="dropdown-item dropdown-item-danger"
              >
                <IoTrashOutline size={16} />
                {isDeleting
                  ? 'Deleting…'
                  : showConfirm
                    ? 'Confirm delete?'
                    : 'Delete post'}
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
