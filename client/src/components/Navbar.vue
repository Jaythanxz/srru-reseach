<template>
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-purple-100/80 dark:border-purple-900/40 text-slate-800 dark:text-slate-100 transition-colors shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18">
        <!-- Logo & Brand -->
        <router-link to="/" class="flex items-center gap-2.5 sm:gap-3 group">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-emerald-500 flex items-center justify-center p-0.5 shadow-xs group-hover:scale-105 transition-transform">
            <div class="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <span class="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-emerald-600 dark:from-purple-400 dark:to-emerald-400">SRRU</span>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <span class="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">คลังงานวิจัยดิจิทัล</span>
              <span class="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-full">มรภ.สุรินทร์</span>
            </div>
            <span class="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-light hidden xs:block">Surindra Rajabhat University Repository</span>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1.5 lg:gap-2">
          <router-link
            to="/"
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            หน้าแรก
          </router-link>

          <router-link
            to="/search"
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            <span>สืบค้นงานวิจัย</span>
            <span class="px-1.5 py-0.2 text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold border border-emerald-200 dark:border-emerald-800">AI Search</span>
          </router-link>

          <router-link
            to="/topic-generator"
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            <span>💡 คิดหัวข้อวิจัย</span>
            <span class="px-1.5 py-0.2 text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded font-bold border border-purple-200 dark:border-purple-700">AI PROPOSAL</span>
          </router-link>

          <router-link
            to="/bookmarks"
            v-if="authStore.isAuthenticated"
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            ที่บันทึกไว้
          </router-link>
        </nav>

        <!-- Right Side: Theme Toggle + User Profile Dropdown Menu & Mobile Hamburger -->
        <div class="flex items-center gap-2 sm:gap-3 relative">
          <!-- ☀️ / 🌙 Theme Toggle Button (Light / Dark Switcher) -->
          <button
            type="button"
            @click="themeStore.toggleTheme"
            class="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-purple-50 dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-slate-800 border border-purple-200/80 dark:border-purple-800/80 text-slate-700 dark:text-purple-200 transition-all flex items-center gap-1.5 shadow-2xs group"
            :title="themeStore.isDark ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'"
          >
            <span class="text-sm transition-transform duration-300 group-hover:rotate-45">
              {{ themeStore.isDark ? '🌙' : '☀️' }}
            </span>
            <span class="text-[11px] font-bold hidden lg:inline-block">
              {{ themeStore.isDark ? 'โหมดมืด' : 'โหมดสว่าง' }}
            </span>
          </button>

          <!-- User Profile Dropdown Button -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="dropdownRef">
            <button
              @click="isMenuOpen = !isMenuOpen"
              class="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-purple-50 dark:bg-slate-900 hover:bg-purple-100/80 dark:hover:bg-slate-800 border border-purple-200/80 dark:border-purple-800 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
            >
              <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-purple-700 to-emerald-500 text-white font-bold flex items-center justify-center text-[10px] sm:text-[11px] shadow-xs">
                {{ authStore.userName.charAt(0) || 'U' }}
              </div>
              <div class="text-left hidden sm:block">
                <div class="font-bold text-slate-900 leading-tight">{{ authStore.userName }}</div>
                <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{{ authStore.userRole }}</div>
              </div>
              <svg class="w-3.5 h-3.5 text-purple-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <!-- Dropdown Menu Box -->
            <div
              v-if="isMenuOpen"
              class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div class="px-4 py-2 border-b border-purple-50 dark:border-purple-900/40 mb-1">
                <p class="text-xs font-bold text-slate-900 dark:text-white">{{ authStore.userName }}</p>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ authStore.user?.email || 'บัญชีผู้ใช้งาน' }}</p>
              </div>

              <!-- Quick Switch Role Row in Menu -->
              <div class="px-4 py-2 bg-purple-50/50 dark:bg-purple-950/40 my-1">
                <span class="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block mb-1.5">สลับบทบาททดสอบ:</span>
                <div class="grid grid-cols-3 gap-1 text-[11px]">
                  <button
                    @click="switchRole('STUDENT')"
                    :class="['py-1 rounded-lg font-bold transition-all text-center', authStore.isStudent ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100']"
                  >
                    นักศึกษา
                  </button>
                  <button
                    @click="switchRole('TEACHER')"
                    :class="['py-1 rounded-lg font-bold transition-all text-center', authStore.isTeacher ? 'bg-purple-700 text-white shadow-xs' : 'bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100']"
                  >
                    อาจารย์
                  </button>
                  <button
                    @click="switchRole('ADMIN')"
                    :class="['py-1 rounded-lg font-bold transition-all text-center', authStore.isAdmin ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100']"
                  >
                    แอดมิน
                  </button>
                </div>
              </div>

              <!-- Role Specific Links -->
              <div class="py-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-200">
                <router-link
                  v-if="authStore.isStudent || authStore.isAdmin"
                  to="/submit"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <span>📝</span>
                  <span>ส่งผลงานวิจัยใหม่</span>
                </router-link>

                <router-link
                  v-if="authStore.canReview"
                  to="/teacher/review"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-semibold text-purple-900 dark:text-purple-300"
                >
                  <span>✅</span>
                  <span>ตรวจอนุมัติงานวิจัย</span>
                </router-link>

                <router-link
                  v-if="authStore.isAdmin || authStore.isTeacher"
                  to="/admin"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <span>📊</span>
                  <span>แดชบอร์ดสถิติ KPI</span>
                </router-link>

                <router-link
                  to="/bookmarks"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <span>🔖</span>
                  <span>งานวิจัยที่บันทึกไว้</span>
                </router-link>
              </div>

              <div class="pt-2 border-t border-purple-50 dark:border-purple-900/40 mt-1 px-2">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Unauthenticated Login/Register -->
          <div v-else class="flex items-center gap-1.5 sm:gap-2">
            <router-link
              to="/login"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl transition-colors"
            >
              เข้าสู่ระบบ
            </router-link>
            <router-link
              to="/register"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs hover:shadow transition-all"
            >
              ลงทะเบียน
            </router-link>
          </div>

          <!-- Mobile Hamburger Menu Button -->
          <button
            @click="isMobileDrawerOpen = !isMobileDrawerOpen"
            class="md:hidden p-2 rounded-xl bg-purple-50 dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-800 border border-purple-200 dark:border-purple-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileDrawerOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div v-if="isMobileDrawerOpen" class="md:hidden border-t border-purple-100 dark:border-purple-900/50 py-3 space-y-1 text-xs animate-in slide-in-from-top-2 duration-200">
        <router-link
          to="/"
          @click="isMobileDrawerOpen = false"
          class="flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-800"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>🏠</span>
          <span>หน้าแรก</span>
        </router-link>

        <router-link
          to="/search"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-800"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <div class="flex items-center gap-2">
            <span>🔍</span>
            <span>สืบค้นงานวิจัย</span>
          </div>
          <span class="px-1.5 py-0.2 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold">AI Search</span>
        </router-link>

        <router-link
          to="/topic-generator"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-800"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <div class="flex items-center gap-2">
            <span>💡</span>
            <span>AI คิดหัวข้อวิจัย</span>
          </div>
          <span class="px-1.5 py-0.2 text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded font-bold">PROPOSAL</span>
        </router-link>

        <router-link
          v-if="authStore.isAuthenticated"
          to="/bookmarks"
          @click="isMobileDrawerOpen = false"
          class="flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-800"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>🔖</span>
          <span>งานวิจัยที่บันทึกไว้</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();
const isMenuOpen = ref(false);
const isMobileDrawerOpen = ref(false);
const dropdownRef = ref(null);

const switchRole = async (role) => {
  try {
    await authStore.quickSwitchRole(role);
    isMenuOpen.value = false;
    isMobileDrawerOpen.value = false;
    if (role === 'TEACHER') router.push('/teacher/review');
    else if (role === 'ADMIN') router.push('/admin');
    else router.push('/');
  } catch (err) {
    console.error('Role switch failed:', err);
  }
};

const handleLogout = () => {
  isMenuOpen.value = false;
  isMobileDrawerOpen.value = false;
  authStore.logout();
  router.push('/');
};

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
