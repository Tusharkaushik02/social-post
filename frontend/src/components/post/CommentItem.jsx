import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoChevronDown, IoChevronUp, IoTrashOutline } from 'react-icons/io5';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/lib/utils';
import { useCommentStore } from '@/stores/useCommentStore';

function getId(value) {
  return value?._id || value?.id;
}

function getAuthor(comment) {
  const rawAuthor = comment.user || comment.User || {};
  return {
    ...rawAuthor,
    displayName: rawAuthor.displayName || rawAuthor.displayname || rawAuthor.username || 'Unknown user',
    avatar: rawAuthor.avatar || rawAuthor.avatarUrl || '',
    username: rawAuthor.username || 'unknown',
  };
}

const EMPTY_REPLIES = [];

export default function CommentItem({ comment, postId, depth = 0 }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const replies = useCommentStore((s) => s.replies[getId(comment)] ?? EMPTY_REPLIES);
  const fetchReplies = useCommentStore((s) => s.fetchReplies);
  const addComment = useCommentStore((s) => s.addComment);
  const deleteComment = useCommentStore((s) => s.deleteComment);

  const author = getAuthor(comment);
  const commentId = getId(comment);
  const authorId = getId(comment.user || comment.User);
  const currentUserId = getId(user);
  const isAuthor = Boolean(authorId && currentUserId && authorId === currentUserId);
  const canThread = depth === 0;
  const replyCount = comment.replyCount ?? replies.length ?? 0;

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    const text = replyText.trim();
    if (!text) return;
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment(postId, text, comment);
      setReplyText('');
      setIsReplying(false);
      setShowReplies(true);
    } catch {
      toast.error('Could not add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRepliesToggle = async () => {
    if (!showReplies && replies.length === 0) {
      try {
        await fetchReplies(commentId);
      } catch {
        toast.error('Could not load replies');
      }
    }
    setShowReplies((value) => !value);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(commentId, postId);
    } catch {
      toast.error('Could not delete comment');
      setIsDeleting(false);
    }
  };

  return (
    <article className={`comment-item${depth > 0 ? ' comment-item-reply' : ''}`}>
      <Link to={`/profile/${author.username}`} aria-label={`${author.displayName}'s profile`}>
        <Avatar
          src={author.avatar}
          alt={author.displayName}
          fallbackName={author.displayName}
          size={depth > 0 ? 'xs' : 'sm'}
        />
      </Link>

      <div className="comment-content">
        <div className="comment-bubble">
          <div className="comment-meta">
            <Link to={`/profile/${author.username}`} className="comment-username">
              {author.displayName}
            </Link>
            <span className="comment-timestamp">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className="comment-text">{comment.text}</p>
        </div>

        <div className="comment-actions-row">
          {canThread && (
            <button
              type="button"
              className="comment-action"
              onClick={() => (isAuthenticated ? setIsReplying((value) => !value) : openAuthModal('login'))}
            >
              Reply
            </button>
          )}
          {isAuthor && (
            <button
              type="button"
              className="comment-action comment-action-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <IoTrashOutline size={14} />
              Delete
            </button>
          )}
        </div>

        {isReplying && canThread && (
          <form className="comment-reply-form" onSubmit={handleReplySubmit}>
            <input
              type="text"
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder={`Reply to ${author.username}`}
              className="comment-input"
              maxLength={500}
              autoFocus
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!replyText.trim() || isSubmitting}
            >
              Reply
            </button>
          </form>
        )}

        {canThread && replyCount > 0 && (
          <button type="button" className="comment-replies-toggle" onClick={handleRepliesToggle}>
            {showReplies ? <IoChevronUp size={14} /> : <IoChevronDown size={14} />}
            {showReplies ? 'Hide replies' : `View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
          </button>
        )}

        {canThread && showReplies && replies.length > 0 && (
          <div className="comment-replies">
            {replies.map((reply) => (
              <CommentItem key={getId(reply)} comment={reply} postId={postId} depth={1} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
