import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const getInitialTheme = () => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('srru_theme') === 'dark';
    }
    return false;
  };

  const isDark = ref(getInitialTheme());

  const applyTheme = (dark) => {
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('srru_theme', dark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme(isDark.value);
  };

  // Apply on init
  applyTheme(isDark.value);

  return {
    isDark,
    toggleTheme
  };
});

