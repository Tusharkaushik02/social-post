/**
 * Search API
 * Handles search-related HTTP requests.
 *
 * Backend endpoints:
 * - GET /api/search?q=term&type=all|users|posts
 */
import api from '@/lib/axios';

export const searchApi = {
  /**
   * Search users and posts.
   * @param {string} query - Search term
   * @param {string} type - 'all', 'users', or 'posts'
   * @returns {Promise} Response with { success, users, posts, query }
   */
  search: (query, type = 'all') => {
    console.log(`[searchApi.search] Searching for: "${query}", type: ${type}`);
    return api.get('/search', { params: { q: query, type } });
  },
};
