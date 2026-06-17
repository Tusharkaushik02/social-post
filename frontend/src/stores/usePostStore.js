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
   * Fetch the first page of posts from backend.
   * GET /api/posts?page=1&limit=PAGE_SIZE → { success: true, posts: [...], hasMore }
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
        hasMore: data.hasMore ?? posts.length === PAGE_SIZE,
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

  fetchMorePosts: async () => {
    const { page, isFetchingMore, hasMore } = get();
    if (isFetchingMore || !hasMore) return;

    set({ isFetchingMore: true, error: null });

    const nextPage = page + 1;
    try {
      const { data } = await postsApi.getAll(nextPage, PAGE_SIZE);
      const newPosts = normalizePosts(data);

      set((state) => ({
        posts: [...state.posts, ...newPosts],
        page: nextPage,
        hasMore: data.hasMore ?? newPosts.length === PAGE_SIZE,
        isFetchingMore: false,
        error: null,
      }));
    } catch (error) {
      const errorMsg = error.message || 'Failed to load more posts';
      console.error('[usePostStore.fetchMorePosts] Error:', errorMsg);
      set({
        isFetchingMore: false,
        error: errorMsg,
      });
      throw error;
    }
  },

  /**
   * Fetch saved posts from backend.
   * GET /api/posts/saved → { success, posts, hasMore }
   */
  fetchSavedPosts: async () => {
    console.log('[usePostStore.fetchSavedPosts] Fetching from backend...');
    set({ isLoading: true, error: null });
    try {
      const { data } = await postsApi.getSaved();
      const posts = normalizePosts(data);

      console.log(`[usePostStore.fetchSavedPosts] Got ${posts.length} saved posts`);
      set({ savedPosts: posts, isLoading: false });
    } catch (error) {
      const errorMsg = error.message || 'Failed to load saved posts';
      console.error('[usePostStore.fetchSavedPosts] Error:', errorMsg);
      set({
        error: errorMsg,
        isLoading: false,
        savedPosts: [],
      });
    }
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
      likesCount: 0,
      isLiked: false,
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
   * Like/unlike a post (toggle)
   * POST /api/posts/:id/like
   * 
   * 1. Optimistic update (toggle isLiked, update likesCount)
   * 2. Call postsApi.like(postId)
   * 3. On error, rollback optimistic update
   */
  likePost: async (postId) => {
    const { posts, savedPosts, profilePosts } = get();
    
    // Helper to create optimistic update
    const apply = (post) => ({
      ...post,
      isLiked: !post.isLiked,
      likesCount: Math.max(0, (post.likesCount || 0) + (post.isLiked ? -1 : 1)),
    });
    
    // Store previous state for rollback
    const previousState = {
      posts: posts.map(p => p._id === postId ? apply(p) : p),
      savedPosts: savedPosts.map(p => p._id === postId ? apply(p) : p),
      profilePosts: profilePosts.map(p => p._id === postId ? apply(p) : p),
    };
    
    // 1. Optimistic update
    set(previousState);
    
    try {
      // 2. Call API to toggle like
      console.log(`[usePostStore.likePost] Toggling like for post: ${postId}`);
      await postsApi.like(postId);
      console.log(`[usePostStore.likePost] Successfully toggled like for post: ${postId}`);
    } catch (error) {
      // 3. Rollback on error
      console.error('[usePostStore.likePost] Error:', error.message);
      set({
        posts: updatePost(posts, postId, post => ({
          ...post,
          isLiked: !post.isLiked,
          likesCount: Math.max(0, (post.likesCount || 0) + (post.isLiked ? -1 : 1)),
        })),
        savedPosts: updatePost(savedPosts, postId, post => ({
          ...post,
          isLiked: !post.isLiked,
          likesCount: Math.max(0, (post.likesCount || 0) + (post.isLiked ? -1 : 1)),
        })),
        profilePosts: updatePost(profilePosts, postId, post => ({
          ...post,
          isLiked: !post.isLiked,
          likesCount: Math.max(0, (post.likesCount || 0) + (post.isLiked ? -1 : 1)),
        })),
      });
      throw error;
    }
  },

  /**
   * Save/unsave a post (toggle)
   * POST /api/posts/:id/save
   *
   * 1. Optimistic update (toggle isSaved)
   * 2. Call postsApi.save(postId)
   * 3. On error, rollback optimistic update
   */
  savePost: async (postId) => {
    const { posts, savedPosts, profilePosts } = get();

    const apply = (post) => ({ ...post, isSaved: !post.isSaved });

    // 1. Optimistic update
    set({
      posts: updatePost(posts, postId, apply),
      savedPosts: updatePost(savedPosts, postId, apply).filter(
        (post) => post.isSaved
      ),
      profilePosts: updatePost(profilePosts, postId, apply),
    });

    try {
      // 2. Call API
      console.log(`[usePostStore.savePost] Toggling save for post: ${postId}`);
      await postsApi.save(postId);
      console.log(`[usePostStore.savePost] Successfully toggled save for post: ${postId}`);
    } catch (error) {
      // 3. Rollback on error
      console.error('[usePostStore.savePost] Error:', error.message);
      set({
        posts: updatePost(posts, postId, apply), // Re-apply to revert
        savedPosts,                                // Restore original
        profilePosts: updatePost(profilePosts, postId, apply),
      });
      throw error;
    }
  },

  updateCommentsCount: (postId, amount) => {
    const apply = (post) => ({
      ...post,
      commentsCount: Math.max(0, (post.commentsCount || 0) + amount),
    });

    set((state) => ({
      posts: updatePost(state.posts, postId, apply),
      savedPosts: updatePost(state.savedPosts, postId, apply),
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
