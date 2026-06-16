import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Avatar from '@/components/ui/Avatar';
import CommentItem from '@/components/post/CommentItem';
import { useAuth } from '@/hooks/useAuth';
import { useCommentStore } from '@/stores/useCommentStore';

function getId(value) {
  return value?._id || value?.id;
}

const EMPTY_COMMENTS = [];

export default function CommentSection({ post }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postId = getId(post);
  const comments = useCommentStore((s) => s.comments[postId] ?? EMPTY_COMMENTS);
  const isLoading = useCommentStore((s) => s.isLoading);
  const error = useCommentStore((s) => s.error);
  const fetchComments = useCommentStore((s) => s.fetchComments);
  const addComment = useCommentStore((s) => s.addComment);

  useEffect(() => {
    if (!postId) return;
    fetchComments(postId).catch(() => {
      toast.error('Could not load comments');
    });
  }, [fetchComments, postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment(postId, trimmedText);
      setText('');
    } catch {
      toast.error('Could not add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="comment-section" aria-label="Comments">
      <form className="comment-composer" onSubmit={handleSubmit}>
        <Avatar
          src={user?.avatar || user?.avatarUrl}
          alt="My avatar"
          fallbackName={user?.displayName || user?.displayname || user?.username || 'Guest'}
          size="sm"
        />
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onFocus={() => {
            if (!isAuthenticated) openAuthModal('login');
          }}
          placeholder="Add a comment"
          aria-label="Add a comment"
          className="comment-input"
          maxLength={500}
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!text.trim() || isSubmitting}
        >
          Post
        </button>
      </form>

      {error && <p className="comment-error">{error}</p>}

      <div className="comment-list">
        {isLoading && comments.length === 0 ? (
          <p className="comment-status">Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={getId(comment)} comment={comment} postId={postId} />
          ))
        ) : (
          <p className="comment-status">No comments yet.</p>
        )}
      </div>
    </section>
  );
}
