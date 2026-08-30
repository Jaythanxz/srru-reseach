import { defineStore } from 'pinia';
import api from '../services/api';

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    faculties: [],
    loading: false,
    error: null,
    total: 0,
    comparedIds: [],
    filters: {
      keyword: '',
      faculty_id: '',
      department_id: '',
      year: '',
      sort: 'newest'
    }
  }),

  getters: {
    comparedProjects: (state) => {
      return state.projects.filter(p => state.comparedIds.includes(p.project_id));
    }
  },

  actions: {
    toggleCompare(projectId) {
      const idx = this.comparedIds.indexOf(projectId);
      if (idx > -1) {
        this.comparedIds.splice(idx, 1);
      } else {
        if (this.comparedIds.length >= 3) {
          alert('สามารถเลือกเปรียบเทียบได้สูงสุด 3 เล่มพร้อมกัน');
          return;
        }
        this.comparedIds.push(projectId);
      }
    },

    clearCompare() {
      this.comparedIds = [];
    },

    isCompared(projectId) {
      return this.comparedIds.includes(projectId);
    },

    async fetchProjects(customFilters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const queryParams = { ...this.filters, ...customFilters };
        const response = await api.get('/projects', { params: queryParams });
        if (response.success) {
          this.projects = response.data;
          this.total = response.total;
        }
      } catch (err) {
        this.error = err.message || 'เกิดข้อผิดพลาดในการโหลดงานวิจัย';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/projects/${id}`);
        if (response.success) {
          this.currentProject = response.data;
          return response.data;
        }
      } catch (err) {
        this.error = err.message || 'ไม่พบงานวิจัย';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchFaculties() {
      try {
        const response = await api.get('/admin/faculties');
        if (response.success) {
          this.faculties = response.data;
        }
      } catch (err) {
        console.error('Fetch faculties error:', err);
      }
    },

    async submitProject(formData) {
      try {
        const response = await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response;
      } catch (err) {
        console.error('Submit project error:', err);
        throw err;
      }
    },

    async recordDownload(projectId) {
      try {
        await api.post(`/projects/${projectId}/download`);
        if (this.currentProject && this.currentProject.project_id === projectId) {
          this.currentProject.download_count += 1;
        }
      } catch (err) {
        console.warn('Record download error:', err);
      }
    }
  }
});
