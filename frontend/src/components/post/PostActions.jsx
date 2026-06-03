import {
  IoBookmark,
  IoBookmarkOutline,
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
  IoPaperPlaneOutline,
} from 'react-icons/io5';
import ProtectedAction from '@/components/common/ProtectedAction';
import { formatCount } from '@/lib/utils';

export default function PostActions({
  post = {},
  onLike,
  onComment,
  onShare,
  onSave,
}) {
  const likesCount = post.likesCount ?? post.likes ?? 0;
  const commentsCount = post.commentsCount ?? 0;

  return (
    <div className="post-actions">
      <div className="post-actions-left">
        {/* Like */}
        <ProtectedAction onAction={onLike}>
          <button
            type="button"
            className={`action-btn${post.isLiked ? ' liked' : ''}`}
            aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
          >
            {post.isLiked ? (
              <IoHeart className="action-icon" style={{ fontSize: '20px', animation: 'heart-pulse 0.3s ease' }} />
            ) : (
              <IoHeartOutline className="action-icon" style={{ fontSize: '20px' }} />
            )}
            {likesCount > 0 && (
              <span className="action-count">
                {formatCount(likesCount)}
              </span>
            )}
          </button>
        </ProtectedAction>

        {/* Comment */}
        <ProtectedAction onAction={onComment}>
          <button
            type="button"
            className="action-btn"
            aria-label="Comment on post"
          >
            <IoChatbubbleOutline className="action-icon" style={{ fontSize: '20px' }} />
            {commentsCount > 0 && (
              <span className="action-count">{formatCount(commentsCount)}</span>
            )}
          </button>
        </ProtectedAction>

        {/* Share */}
        <button
          type="button"
          onClick={onShare}
          className="action-btn"
          aria-label="Share post"
        >
          <IoPaperPlaneOutline className="action-icon" style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* Save */}
      <ProtectedAction onAction={onSave}>
        <button
          type="button"
          className={`action-btn${post.isSaved ? ' saved' : ''}`}
          aria-label={post.isSaved ? 'Unsave post' : 'Save post'}
        >
          {post.isSaved ? (
            <IoBookmark className="action-icon" style={{ fontSize: '20px', animation: 'bookmark-pop 0.3s ease' }} />
          ) : (
            <IoBookmarkOutline className="action-icon" style={{ fontSize: '20px' }} />
          )}
        </button>
      </ProtectedAction>
    </div>
  );
}
