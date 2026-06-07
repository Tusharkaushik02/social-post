import { create } from 'zustand';
import { postsApi } from '@/api/posts.api';
import { usersApi } from '@/api/users.api';
import { POSTS_PER_PAGE } from '@/config/constants';

const PAGE_SIZE = POSTS_PER_PAGE;

/**
 * Normalize posts response from backend
 * Backend returns: { success: true, posts: Array<post> } or Array<post>
 * @param {any} data - Raw response data
 * @returns {Array} Array of posts
 */
function normalizePosts(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.posts)) return data.posts;
  console.warn('[normalizePosts] Unexpected data shape:', typeof data);
  return [];
}

function updatePost(posts, postId, updater) {
  return posts.map((post) => (post._id === postId ? updater(post) : post));
}

export const usePostStore = create((set, get) => ({
  posts: [],
  profilePosts: [],
  savedPosts: [],
  isLoading: false,
  isFetchingMore: false,
  hasMore: false,
  page: 1,
  error: null,

  /**
   * Fetch all posts from backend
   * GET /api/posts → { success: true, posts: [...] }
   */
  fetchPosts: async () => {
    console.log('[usePostStore.fetchPosts] Starting fetch...');
    set({ isLoading: true, error: null, page: 1, hasMore: false });
    try {
      const { data } = await postsApi.getAll(1, PAGE_SIZE);
      const posts = normalizePosts(data);

      console.log(`[usePostStore.fetchPosts] Got ${posts.length} posts`);
      set({
        posts,
        page: 1,
        hasMore: false, // Backend doesn't support pagination
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMsg = error.message || 'Failed to load posts';
      console.error('[usePostStore.fetchPosts] Error:', errorMsg);
      set({
        error: errorMsg,
        isLoading: false,
        posts: [],
      });
      throw error;
    }
  },

  /**
   * Fetch more posts (pagination)
   * Backend doesn't support pagination — no-op
   */
  fetchMorePosts: async () => {
    const { isFetchingMore, hasMore } = get();
    if (isFetchingMore || !hasMore) return;
    set({ hasMore: false });
  },

  /**
   * Fetch saved posts (client-side filter — backend doesn't support this)
   */
  fetchSavedPosts: async () => {
    set({ isLoading: true, error: null });
    const saved = get().posts.filter((post) => post.isSaved);
    set({ savedPosts: saved, isLoading: false });
  },

  /**
   * Fetch posts by a specific user via the users API
   * GET /api/users/:username/posts
   */
  fetchPostsByUser: async (username) => {
    console.log(`[usePostStore.fetchPostsByUser] Fetching posts for: ${username}`);
    set({ isLoading: true, error: null });
    try {
      const { data } = await usersApi.getUserPosts(username);
      const posts = normalizePosts(data);

      console.log(`[usePostStore.fetchPostsByUser] Got ${posts.length} posts for ${username}`);
      set({ profilePosts: posts, isLoading: false });
    } catch (error) {
      console.error('[usePostStore.fetchPostsByUser] Error:', error.message);
      set({
        error: 'Failed to load profile posts',
        isLoading: false,
        profilePosts: [],
      });
    }
  },

  /**
   * Create a new post
   * POST /api/posts/create (FormData with 'image' + 'caption')
   */
  createPost: async ({ caption, imageFile, imagePreview }) => {
    console.log('[usePostStore.createPost] Creating post with caption:', caption);

    // Optimistic placeholder (will be replaced with real post from backend)
    const optimisticPost = {
      _id: `local-${Date.now()}`,
      User: null,
      caption,
      image: imagePreview,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ posts: [optimisticPost, ...state.posts] }));

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (imageFile) formData.append('image', imageFile);

      const { data } = await postsApi.create(formData);
      const createdPost = data.post || data;
      console.log('[usePostStore.createPost] Post created:', createdPost._id);

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === optimisticPost._id ? createdPost : post
        ),
      }));
      return createdPost;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create post';
      console.error('[usePostStore.createPost] Error:', errorMsg);

      set((state) => ({
        posts: state.posts.filter((p) => p._id !== optimisticPost._id),
        error: errorMsg,
      }));
      throw error;
    }
  },

  /**
   * Like/unlike a post
   * Backend doesn't support like endpoint — optimistic only
   */
  likePost: async (postId) => {
    const apply = (post) => ({
      ...post,
      isLiked: !post.isLiked,
      likes: Math.max(0, (post.likes || 0) + (post.isLiked ? -1 : 1)),
    });

    set((state) => ({
      posts: updatePost(state.posts, postId, apply),
      savedPosts: updatePost(state.savedPosts, postId, apply),
      profilePosts: updatePost(state.profilePosts, postId, apply),
    }));
  },

  /**
   * Save/unsave a post
   * Backend doesn't support save endpoint — optimistic only
   */
  savePost: async (postId) => {
    const apply = (post) => ({ ...post, isSaved: !post.isSaved });

    set((state) => ({
      posts: updatePost(state.posts, postId, apply),
      savedPosts: updatePost(state.savedPosts, postId, apply).filter(
        (post) => post.isSaved
      ),
      profilePosts: updatePost(state.profilePosts, postId, apply),
    }));
  },

  resetFeed: () => {
    set({
      posts: [],
      profilePosts: [],
      savedPosts: [],
      page: 1,
      hasMore: false,
      error: null,
      isLoading: false,
    });
  },
}));
