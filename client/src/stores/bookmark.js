import { defineStore } from 'pinia';
import api from '../services/api';

export const useBookmarkStore = defineStore('bookmark', {
  state: () => ({
    bookmarks: [],
    bookmarkedIds: new Set(),
    loading: false
  }),

  actions: {
    async fetchBookmarks() {
      this.loading = true;
      try {
        const response = await api.get('/user/bookmarks');
        if (response.success) {
          this.bookmarks = response.data;
          this.bookmarkedIds = new Set(response.data.map(b => b.project_id));
        }
      } catch (err) {
        console.warn('Fetch bookmarks failed (likely unauthenticated):', err.message);
      } finally {
        this.loading = false;
      }
    },

    async toggleBookmark(projectId) {
      const isBookmarked = this.bookmarkedIds.has(projectId);
      try {
        if (isBookmarked) {
          await api.delete(`/user/bookmarks/${projectId}`);
          this.bookmarkedIds.delete(projectId);
          this.bookmarks = this.bookmarks.filter(b => b.project_id !== projectId);
        } else {
          await api.post(`/user/bookmarks/${projectId}`);
          this.bookmarkedIds.add(projectId);
        }
        return !isBookmarked;
      } catch (err) {
        console.error('Toggle bookmark error:', err);
        throw err;
      }
    },

    isBookmarked(projectId) {
      return this.bookmarkedIds.has(projectId);
    }
  }
});
