import { defineStore } from 'pinia';
import api from '../services/api';

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    personalizedProjects: [],
    similarProjects: [],
    loadingPersonalized: false,
    loadingSimilar: false,
    meta: null
  }),

  actions: {
    async fetchPersonalized(limit = 6) {
      this.loadingPersonalized = true;
      try {
        const response = await api.get('/recommendations/personalized', { params: { limit } });
        if (response.success) {
          this.personalizedProjects = response.data;
          this.meta = {
            algorithm: response.algorithm,
            weights: response.weights
          };
        }
      } catch (err) {
        console.error('Fetch personalized recommendations failed:', err);
      } finally {
        this.loadingPersonalized = false;
      }
    },

    async fetchSimilar(projectId, limit = 4) {
      this.loadingSimilar = true;
      try {
        const response = await api.get(`/recommendations/similar/${projectId}`, { params: { limit } });
        if (response.success) {
          this.similarProjects = response.data;
          return response.data;
        }
      } catch (err) {
        console.error('Fetch similar projects failed:', err);
        return [];
      } finally {
        this.loadingSimilar = false;
      }
    }
  }
});
