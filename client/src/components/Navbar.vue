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
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            สืบค้นงานวิจัย
          </router-link>

          <router-link
            to="/topic-generator"
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            คิดหัวข้อวิจัย
          </router-link>

          <!-- My Submissions Link for Students -->
          <router-link
            to="/my-submissions"
            v-if="authStore.isAuthenticated && (authStore.userRole === 'STUDENT' || authStore.userRole === 'ADMIN')"
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
            active-class="!text-purple-800 dark:!text-purple-300 !bg-purple-50 dark:!bg-purple-950/60 !font-bold"
          >
            <span>ผลงานของฉัน</span>
            <span v-if="unreadCount > 0" class="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded-full font-bold">
              {{ unreadCount }}
            </span>
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
          <!-- Theme Toggle Icon Button (Clean Modern SVG) -->
          <button
            type="button"
            @click="themeStore.toggleTheme"
            class="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-slate-800 border border-purple-200/80 dark:border-purple-800/80 text-slate-700 dark:text-purple-200 transition-all flex items-center justify-center shadow-2xs group"
            :title="themeStore.isDark ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'"
          >
            <!-- Sun Icon for Dark Mode -->
            <svg v-if="themeStore.isDark" class="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <!-- Moon Icon for Light Mode -->
            <svg v-else class="w-4 h-4 text-purple-700 group-hover:-rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Student & Faculty Notification Bell (Clean Modern SVG) -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="notifRef">
            <button
              type="button"
              @click="isNotifOpen = !isNotifOpen"
              class="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-slate-800 border border-purple-200/80 dark:border-purple-800/80 text-slate-700 dark:text-purple-200 transition-all flex items-center justify-center shadow-2xs relative group"
              title="การแจ้งเตือนผลการตรวจประเมิน"
            >
              <svg class="w-4 h-4 text-slate-700 dark:text-purple-200 group-hover:rotate-12 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-950 animate-bounce"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notification Dropdown Panel (Responsive: full width on mobile, anchored on desktop) -->
            <div
              v-if="isNotifOpen"
              class="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-2xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
            >
              <div class="p-3.5 bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-950/60 dark:to-emerald-950/40 border-b border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span class="font-bold text-xs text-slate-800 dark:text-slate-200">การแจ้งเตือนผลการตรวจ</span>
                </div>
                <span v-if="unreadCount > 0" class="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {{ unreadCount }} งานต้องแก้ไข
                </span>
              </div>

              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                <div v-if="notifications.length === 0" class="p-6 text-center text-xs text-slate-400">
                  ไม่มีการแจ้งเตือนใหม่ในขณะนี้
                </div>
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  @click="handleNotificationClick(notif)"
                  :class="[
                    'p-3.5 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 transition-colors cursor-pointer space-y-1.5',
                    notif.type === 'REJECTED' ? 'bg-rose-50/40 dark:bg-rose-950/30' : ''
                  ]"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span
                      :class="[
                        'text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1',
                        notif.type === 'REJECTED' ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200'
                      ]"
                    >
                      <span>{{ notif.type === 'REJECTED' ? '⚠️ ส่งกลับแก้ไข' : '✅ อนุมัติแล้ว' }}</span>
                    </span>
                    <span class="text-[10px] text-slate-400">
                      {{ formatRelativeTime(notif.time) }}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {{ notif.title }}
                  </h4>
                  <p class="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    {{ notif.message }}
                  </p>
                  <div class="text-[10px] text-purple-600 dark:text-purple-400 font-medium flex items-center justify-between pt-0.5">
                    <span>โดย: {{ notif.sender }}</span>
                    <span class="font-bold underline text-rose-600 dark:text-rose-400">คลิกดูและแก้ไข →</span>
                  </div>
                </div>
              </div>

              <div class="p-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center">
                <router-link
                  to="/my-submissions"
                  @click="isNotifOpen = false"
                  class="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline block py-1"
                >
                  ดูผลงานทั้งหมดของฉัน (My Submissions) →
                </router-link>
              </div>
            </div>
          </div>

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
                <div class="font-bold text-slate-900 dark:text-white leading-tight">{{ authStore.userName }}</div>
                <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{{ authStore.userRole }}</div>
              </div>
              <svg class="w-3.5 h-3.5 text-purple-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <!-- Dropdown Menu Box (Responsive: centered on mobile, anchored on desktop) -->
            <div
              v-if="isMenuOpen"
              class="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/60 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
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
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>ส่งผลงานวิจัยใหม่</span>
                </router-link>

                <router-link
                  v-if="authStore.canReview"
                  to="/teacher/review"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-semibold text-purple-900 dark:text-purple-300"
                >
                  <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ตรวจอนุมัติงานวิจัย</span>
                </router-link>

                <router-link
                  v-if="authStore.isAdmin || authStore.isTeacher"
                  to="/admin"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>แดชบอร์ดสถิติ KPI</span>
                </router-link>

                <router-link
                  to="/bookmarks"
                  @click="isMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>งานวิจัยที่บันทึกไว้</span>
                </router-link>
              </div>

              <div class="pt-2 border-t border-purple-50 dark:border-purple-900/40 mt-1 px-2">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
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

            <!-- Mobile Navigation Drawer (Full-Featured & Responsive) -->
      <div v-if="isMobileDrawerOpen" class="md:hidden border-t border-purple-100 dark:border-purple-900/50 py-3 space-y-1.5 text-xs animate-in slide-in-from-top-2 duration-200">
        <router-link
          to="/"
          @click="isMobileDrawerOpen = false"
          class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>หน้าแรก</span>
        </router-link>

        <router-link
          to="/search"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>สืบค้นงานวิจัย</span>
        </router-link>

        <router-link
          to="/topic-generator"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>คิดหัวข้อวิจัย</span>
        </router-link>

        <!-- My Submissions on Mobile -->
        <router-link
          v-if="authStore.isAuthenticated && (authStore.userRole === 'STUDENT' || authStore.userRole === 'ADMIN')"
          to="/my-submissions"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>ผลงานของฉัน</span>
          <span v-if="unreadCount > 0" class="px-2 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
            {{ unreadCount }} งานต้องแก้ไข
          </span>
        </router-link>

        <router-link
          v-if="authStore.isAuthenticated"
          to="/bookmarks"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          active-class="!bg-purple-100/80 dark:!bg-purple-950/80 !text-purple-900 dark:!text-purple-200"
        >
          <span>ที่บันทึกไว้</span>
        </router-link>

        <router-link
          v-if="authStore.isStudent || authStore.isAdmin"
          to="/submit"
          @click="isMobileDrawerOpen = false"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300"
        >
          <span>ส่งผลงานวิจัยใหม่</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </router-link>

        <!-- Mobile User Profile & Quick Role Switcher -->
        <div v-if="authStore.isAuthenticated" class="pt-2 border-t border-purple-100 dark:border-purple-900/50 mt-2 space-y-2">
          <div class="px-3.5 flex items-center justify-between">
            <span class="font-bold text-slate-800 dark:text-slate-200">{{ authStore.userName }}</span>
            <span class="text-[10px] font-bold text-emerald-600 uppercase">{{ authStore.userRole }}</span>
          </div>

          <div class="grid grid-cols-3 gap-1.5 px-3 py-1">
            <button
              @click="switchRole('STUDENT')"
              :class="['py-1.5 rounded-xl font-bold text-center text-xs transition-all', authStore.isStudent ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300']"
            >
              นักศึกษา
            </button>
            <button
              @click="switchRole('TEACHER')"
              :class="['py-1.5 rounded-xl font-bold text-center text-xs transition-all', authStore.isTeacher ? 'bg-purple-700 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300']"
            >
              อาจารย์
            </button>
            <button
              @click="switchRole('ADMIN')"
              :class="['py-1.5 rounded-xl font-bold text-center text-xs transition-all', authStore.isAdmin ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300']"
            >
              แอดมิน
            </button>
          </div>

          <div class="px-3 pt-1">
            <button
              @click="handleLogout"
              class="w-full py-2 rounded-xl text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 text-center"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import { useRouter } from 'vue-router';
import api from '../services/api';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();
const isMenuOpen = ref(false);
const isMobileDrawerOpen = ref(false);
const isNotifOpen = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const dropdownRef = ref(null);
const notifRef = ref(null);

const fetchNotifications = async () => {
  if (!authStore.isAuthenticated) {
    notifications.value = [];
    unreadCount.value = 0;
    return;
  }
  try {
    const res = await api.get('/user/notifications');
    notifications.value = res.data || [];
    unreadCount.value = res.unreadCount || 0;
  } catch (err) {
    // Non-fatal
  }
};

const formatRelativeTime = (time) => {
  if (!time) return '';
  const diff = Date.now() - new Date(time).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เมื่อสักครู่';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
};

const handleNotificationClick = (notif) => {
  isNotifOpen.value = false;
  router.push('/my-submissions');
};

const switchRole = async (role) => {
  try {
    await authStore.quickSwitchRole(role);
  await fetchNotifications();
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
  fetchNotifications();
  // Poll notifications periodically
  const notifInterval = setInterval(fetchNotifications, 30000);
  onUnmounted(() => clearInterval(notifInterval));
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
