import {
  IoBookmark,
  IoBookmarkOutline,
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
  IoPaperPlaneOutline,
} from 'react-icons/io5';
import IconButton from '@/components/ui/IconButton';
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
    <div className="mt-4 flex items-center justify-between text-on-surface-variant">
      <div className="flex items-center gap-6">
        <ProtectedAction onAction={onLike}>
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-primary transition-colors group active:scale-95 duration-200"
            aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
          >
            {post.isLiked ? (
              <IoHeart className="text-red-500 fill-current text-[20px]" />
            ) : (
              <IoHeartOutline className="group-active:scale-75 transition-transform text-[20px]" />
            )}
            <span className="text-label-sm font-label-sm">{formatCount(likesCount)}</span>
          </button>
        </ProtectedAction>

        <ProtectedAction onAction={onComment}>
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-primary transition-colors group active:scale-95 duration-200"
            aria-label="Comment"
          >
            <IoChatbubbleOutline className="group-active:scale-75 transition-transform text-[20px]" />
            <span className="text-label-sm font-label-sm">{formatCount(commentsCount)}</span>
          </button>
        </ProtectedAction>

        <button
          type="button"
          onClick={onShare}
          className="flex items-center gap-1.5 hover:text-primary transition-colors group active:scale-95 duration-200"
          aria-label="Share post"
        >
          <IoPaperPlaneOutline className="group-active:scale-75 transition-transform text-[20px]" />
        </button>
      </div>

      <ProtectedAction onAction={onSave}>
        <button
          type="button"
          onClick={onSave}
          className="ml-auto hover:text-primary transition-colors group active:scale-95 duration-200"
          aria-label={post.isSaved ? 'Unsave post' : 'Save post'}
        >
          {post.isSaved ? (
            <IoBookmark className="text-secondary fill-current text-[20px]" />
          ) : (
            <IoBookmarkOutline className="group-active:scale-75 transition-transform text-[20px]" />
          )}
        </button>
      </ProtectedAction>
    </div>
  );
}
