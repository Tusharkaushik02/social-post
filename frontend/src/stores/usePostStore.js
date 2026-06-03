import { create } from 'zustand';
import { postsApi } from '@/api/posts.api';
import { POSTS_PER_PAGE } from '@/config/constants';
import { currentMockUser, mockPosts } from '@/data/mockData';

const PAGE_SIZE = POSTS_PER_PAGE;

function paginate(items, page, limit = PAGE_SIZE) {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

/**
 * Normalize posts response from backend
 * Backend returns: Array<post> (not paginated)
 * @param {any} data - Raw response data
 * @returns {Array} Array of posts
 */
function normalizePosts(data) {
  if (Array.isArray(data)) {
    console.log(`[normalizePosts] Received array of ${data.length} posts`);
    return data;
  }
  console.warn('[normalizePosts] Expected array, got:', typeof data, data);
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
  hasMore: true,
  page: 1,
  error: null,

  /**
   * Fetch all posts from backend
   * 
   * Backend: GET /posts → returns Array<post>
   * No pagination support in backend (page/limit params ignored)
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
        posts: [], // Clear posts on error (don't fall back to mock)
      });
      throw error; // Re-throw so UI can handle it
    }
  },

  /**
   * Fetch more posts (pagination)
   * 
   * Note: Backend doesn't support pagination, so this is a no-op
   * All posts are fetched in one request
   */
  fetchMorePosts: async () => {
    console.warn('[usePostStore.fetchMorePosts] Backend does not support pagination');
    const { isFetchingMore, hasMore } = get();
    if (isFetchingMore || !hasMore) return;
    
    // Backend doesn't support pagination, so there are no "more" posts
    set({ hasMore: false });
  },

  /**
   * Fetch saved posts
   * @deprecated Backend doesn't have /posts/saved endpoint
   */
  fetchSavedPosts: async () => {
    console.warn('[usePostStore.fetchSavedPosts] Backend does not support saved posts endpoint');
    set({ isLoading: true, error: null });
    try {
      // Fallback: filter posts with isSaved flag (client-side filtering)
      const saved = get().posts.filter((post) => post.isSaved);
      set({ savedPosts: saved, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to load saved posts', 
        isLoading: false,
        savedPosts: [], 
      });
    }
  },

  /**
   * Fetch posts by user
   * @deprecated Backend doesn't have /posts/user/:username endpoint
   */
  fetchPostsByUser: async (username) => {
    console.warn(`[usePostStore.fetchPostsByUser] Backend does not support user posts endpoint (username: ${username})`);
    set({ isLoading: true, error: null });
    try {
      // Fallback: filter all posts by user (client-side filtering)
      // This requires all posts to have loaded first
      const filtered = get().posts.filter((post) => post.user?.username === username);
      set({ profilePosts: filtered, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to load profile posts', 
        isLoading: false,
        profilePosts: [], 
      });
    }
  },

  /**
   * Create a new post
   * 
   * Backend: POST /create-post
   * Expects: FormData with 'image' (file) and 'caption' (string)
   * Returns: { message: string, post: {...} }
   */
  createPost: async ({ caption, imageFile, imagePreview }) => {
    console.log('[usePostStore.createPost] Creating post with caption:', caption);
    
    const optimisticPost = {
      _id: `local-${Date.now()}`,
      user: currentMockUser,
      caption,
      image: imagePreview,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isSaved: false,
    };

    // Optimistic update: show post immediately
    set((state) => ({ posts: [optimisticPost, ...state.posts] }));

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (imageFile) formData.append('image', imageFile);
      
      console.log('[usePostStore.createPost] Sending FormData with:', {
        caption,
        hasImage: !!imageFile,
        imageSize: imageFile?.size,
        imageName: imageFile?.name,
      });

      const { data } = await postsApi.create(formData);
      
      // Backend returns: { message: string, post: {...} }
      const createdPost = data.post || data;
      console.log('[usePostStore.createPost] Post created successfully:', createdPost._id);
      
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === optimisticPost._id ? createdPost : post
        ),
      }));
      return createdPost;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create post';
      console.error('[usePostStore.createPost] Error:', errorMsg);
      
      // Keep optimistic post for now (user can retry)
      // Remove it from posts on permanent failure
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== optimisticPost._id),
        error: errorMsg,
      }));
      throw error;
    }
  },

  /**
   * Like/unlike a post
   * @deprecated Backend doesn't support like endpoint
   * Currently optimistic only (local state change, no backend sync)
   */
  likePost: async (postId) => {
    console.warn(`[usePostStore.likePost] Backend does not support like endpoint (Post ID: ${postId})`);
    
    const apply = (post) => ({
      ...post,
      isLiked: !post.isLiked,
      likes: Math.max(0, (post.likes || 0) + (post.isLiked ? -1 : 1)),
    });

    // Optimistic update (client-side only)
    set((state) => ({
      posts: updatePost(state.posts, postId, apply),
      savedPosts: updatePost(state.savedPosts, postId, apply),
      profilePosts: updatePost(state.profilePosts, postId, apply),
    }));

    // Backend endpoint not implemented - would call:
    // const post = get().posts.find((item) => item._id === postId);
    // try {
    //   if (post?.isLiked) await postsApi.like(postId);
    //   else await postsApi.unlike(postId);
    // } catch (error) {
    //   // Revert optimistic update on error
    // }
  },

  /**
   * Save/unsave a post
   * @deprecated Backend doesn't support save endpoint
   * Currently optimistic only (local state change, no backend sync)
   */
  savePost: async (postId) => {
    console.warn(`[usePostStore.savePost] Backend does not support save endpoint (Post ID: ${postId})`);
    
    const apply = (post) => ({ ...post, isSaved: !post.isSaved });

    // Optimistic update (client-side only)
    set((state) => ({
      posts: updatePost(state.posts, postId, apply),
      savedPosts: updatePost(state.savedPosts, postId, apply).filter(
        (post) => post.isSaved
      ),
      profilePosts: updatePost(state.profilePosts, postId, apply),
    }));

    // Backend endpoint not implemented - would call:
    // const post = get().posts.find((item) => item._id === postId);
    // try {
    //   if (post?.isSaved) await postsApi.save(postId);
    //   else await postsApi.unsave(postId);
    // } catch (error) {
    //   // Revert optimistic update on error
    // }
  },

  resetFeed: () => {
    console.log('[usePostStore.resetFeed] Resetting feed');
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
