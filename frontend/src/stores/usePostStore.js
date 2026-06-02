import { create } from 'zustand';
import { postsApi } from '@/api/posts.api';
import { POSTS_PER_PAGE } from '@/config/constants';
import { currentMockUser, mockPosts } from '@/data/mockData';

const PAGE_SIZE = POSTS_PER_PAGE;

function paginate(items, page, limit = PAGE_SIZE) {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

function normalizePosts(data) {
  if (Array.isArray(data)) return data;
  return data?.posts || data?.data || [];
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

  fetchPosts: async () => {
    set({ isLoading: true, error: null, page: 1, hasMore: true });
    try {
      let posts;
      try {
        const { data } = await postsApi.getAll(1, PAGE_SIZE);
        posts = normalizePosts(data);
      } catch {
        posts = paginate(mockPosts, 1);
      }

      set({
        posts,
        page: 1,
        hasMore: posts.length >= PAGE_SIZE,
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to load posts', isLoading: false });
    }
  },

  fetchMorePosts: async () => {
    const { isFetchingMore, hasMore, page } = get();
    if (isFetchingMore || !hasMore) return;

    const nextPage = page + 1;
    set({ isFetchingMore: true });
    try {
      let posts;
      try {
        const { data } = await postsApi.getAll(nextPage, PAGE_SIZE);
        posts = normalizePosts(data);
      } catch {
        posts = paginate(mockPosts, nextPage);
      }

      set((state) => ({
        posts: [...state.posts, ...posts],
        page: nextPage,
        hasMore: posts.length >= PAGE_SIZE,
        isFetchingMore: false,
      }));
    } catch {
      set({ isFetchingMore: false });
    }
  },

  fetchSavedPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      let posts;
      try {
        const { data } = await postsApi.getSaved(1);
        posts = normalizePosts(data);
      } catch {
        posts = get().posts.filter((post) => post.isSaved);
      }
      set({ savedPosts: posts, isLoading: false });
    } catch {
      set({ error: 'Failed to load saved posts', isLoading: false });
    }
  },

  fetchPostsByUser: async (username) => {
    set({ isLoading: true, error: null });
    try {
      let posts;
      try {
        const { data } = await postsApi.getByUser(username, 1);
        posts = normalizePosts(data);
      } catch {
        posts = mockPosts.filter((post) => post.user?.username === username);
      }
      set({ profilePosts: posts, isLoading: false });
    } catch {
      set({ error: 'Failed to load profile posts', isLoading: false });
    }
  },

  createPost: async ({ caption, imageFile, imagePreview }) => {
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

    set((state) => ({ posts: [optimisticPost, ...state.posts] }));

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (imageFile) formData.append('image', imageFile);
      const { data } = await postsApi.create(formData);
      const createdPost = data.post || data;
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === optimisticPost._id ? createdPost : post
        ),
      }));
      return createdPost;
    } catch {
      return optimisticPost;
    }
  },

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

    const post = get().posts.find((item) => item._id === postId);
    try {
      if (post?.isLiked) await postsApi.like(postId);
      else await postsApi.unlike(postId);
    } catch {
      // Mock mode keeps the optimistic interaction.
    }
  },

  savePost: async (postId) => {
    const apply = (post) => ({ ...post, isSaved: !post.isSaved });

    set((state) => ({
      posts: updatePost(state.posts, postId, apply),
      savedPosts: updatePost(state.savedPosts, postId, apply).filter(
        (post) => post.isSaved
      ),
      profilePosts: updatePost(state.profilePosts, postId, apply),
    }));

    const post = get().posts.find((item) => item._id === postId);
    try {
      if (post?.isSaved) await postsApi.save(postId);
      else await postsApi.unsave(postId);
    } catch {
      // Mock mode keeps the optimistic interaction.
    }
  },

  resetFeed: () => {
    set({
      posts: [],
      profilePosts: [],
      savedPosts: [],
      page: 1,
      hasMore: true,
      error: null,
    });
  },
}));
