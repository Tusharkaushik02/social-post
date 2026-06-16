import { create } from 'zustand';
import { commentsApi } from '@/api/comments.api';
import { usePostStore } from '@/stores/usePostStore';

function normalizeCommentUser(user) {
  if (!user || typeof user !== 'object') return {};
  return {
    ...user,
    displayName: user.displayName || user.displayname || user.username || 'Unknown user',
    avatar: user.avatar || user.avatarUrl || '',
    username: user.username || 'unknown',
  };
}

function normalizeComment(comment) {
  const user = normalizeCommentUser(comment.user || comment.User);
  return {
    ...comment,
    user,
    replyCount: comment.replyCount ?? comment.repliesCount ?? 0,
  };
}

function normalizeComments(data, key) {
  if (Array.isArray(data)) return data.map(normalizeComment);
  if (data && Array.isArray(data[key])) return data[key].map(normalizeComment);
  if (data && data.comment) return [normalizeComment(data.comment)];
  return [];
}

function getCommentId(comment) {
  return comment?._id || comment?.id;
}

function incrementPostComments(postId, amount) {
  usePostStore.getState().updateCommentsCount?.(postId, amount);
}

export const useCommentStore = create((set, get) => ({
  comments: {},
  replies: {},
  isLoading: false,
  error: null,

  fetchComments: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await commentsApi.getByPost(postId);
      const comments = normalizeComments(data, 'comments');
      set((state) => ({
        comments: { ...state.comments, [postId]: comments },
        isLoading: false,
        error: null,
      }));
      return comments;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load comments' });
      throw error;
    }
  },

  fetchReplies: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await commentsApi.getReplies(commentId);
      const replies = normalizeComments(data, 'replies');
      set((state) => ({
        replies: { ...state.replies, [commentId]: replies },
        isLoading: false,
        error: null,
      }));
      return replies;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load replies' });
      throw error;
    }
  },

  addComment: async (postId, text, parentComment) => {
    const body = {
      text,
      ...(parentComment ? { parentCommentId: getCommentId(parentComment) } : {}),
    };

    set({ error: null });
    try {
      const { data } = await commentsApi.create(postId, body);
      const createdComment = normalizeComment(data.comment || data);
      const parentId = parentComment ? getCommentId(parentComment) : null;

      set((state) => {
        if (parentId) {
          const parentReplies = state.replies[parentId] || [];
          const topLevel = state.comments[postId] || [];
          return {
            replies: {
              ...state.replies,
              [parentId]: [createdComment, ...parentReplies],
            },
            comments: {
              ...state.comments,
              [postId]: topLevel.map((comment) =>
                getCommentId(comment) === parentId
                  ? { ...comment, replyCount: (comment.replyCount || 0) + 1 }
                  : comment
              ),
            },
          };
        }

        return {
          comments: {
            ...state.comments,
            [postId]: [createdComment, ...(state.comments[postId] || [])],
          },
        };
      });

      incrementPostComments(postId, 1);
      return createdComment;
    } catch (error) {
      set({ error: error.message || 'Failed to add comment' });
      throw error;
    }
  },

  deleteComment: async (commentId, postId) => {
    const state = get();
    const previousComments = state.comments;
    const previousReplies = state.replies;
    const topLevel = state.comments[postId] || [];
    const deletedTopLevel = topLevel.find((comment) => getCommentId(comment) === commentId);
    const deletedReplyParentId = Object.entries(state.replies).find(([, list]) =>
      list.some((reply) => getCommentId(reply) === commentId)
    )?.[0];
    const decrementAmount = deletedTopLevel
      ? 1 + Math.max(deletedTopLevel.replyCount || 0, state.replies[commentId]?.length || 0)
      : 1;

    set((current) => {
      const nextReplies = Object.fromEntries(
        Object.entries(current.replies).map(([parentId, list]) => [
          parentId,
          list.filter((reply) => getCommentId(reply) !== commentId),
        ])
      );

      return {
        comments: {
          ...current.comments,
          [postId]: (current.comments[postId] || [])
            .filter((comment) => getCommentId(comment) !== commentId)
            .map((comment) =>
              getCommentId(comment) === deletedReplyParentId
                ? { ...comment, replyCount: Math.max(0, (comment.replyCount || 0) - 1) }
                : comment
            ),
        },
        replies: deletedTopLevel
          ? Object.fromEntries(Object.entries(nextReplies).filter(([parentId]) => parentId !== commentId))
          : nextReplies,
        error: null,
      };
    });

    incrementPostComments(postId, -decrementAmount);

    try {
      await commentsApi.delete(commentId);
    } catch (error) {
      set({
        comments: previousComments,
        replies: previousReplies,
        error: error.message || 'Failed to delete comment',
      });
      incrementPostComments(postId, decrementAmount);
      throw error;
    }
  },
}));
