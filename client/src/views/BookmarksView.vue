<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Light & Airy Header -->
    <div class="bg-gradient-to-r from-purple-100/80 via-white to-emerald-50/80 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-8 border border-purple-100/90 dark:border-purple-800/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      <div class="max-w-2xl space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
          <span>🔖</span>
          <span>My Research Bookmarks</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">งานวิจัยที่คุณบันทึกไว้</h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          รวบรวมผลงานวิจัยที่คุณสนใจเพื่อการสืบค้นและอ้างอิงอย่างสะดวก และเป็นข้อมูลในการประมวลผลระบบแนะนำ AI ส่วนบุคคล
        </p>
      </div>

      <div class="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-800/60 shadow-2xs text-center self-start md:self-auto">
        <div class="text-lg font-black text-purple-700 dark:text-purple-300">{{ bookmarkStore.bookmarks.length }}</div>
        <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">รายการที่บันทึก</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="bookmarkStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-64 bg-purple-50/80 dark:bg-slate-800/80 rounded-3xl animate-pulse"></div>
    </div>

    <!-- Bookmarks Grid -->
    <div v-else-if="bookmarkStore.bookmarks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="item in bookmarkStore.bookmarks"
        :key="item.project_id"
        :project="item"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-8 space-y-4 shadow-xs">
      <div class="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center text-2xl font-bold">
        🔖
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-white">ยังไม่มีงานวิจัยในรายการบุ๊กมาร์ก</h3>
      <p class="text-xs text-slate-500 dark:text-slate-300 max-w-sm mx-auto">
        คุณสามารถกดไอคอนรูปบุ๊กมาร์กบนการ์ดงานวิจัยเพื่อเก็บผลงานที่คุณสนใจไว้ที่นี่ได้
      </p>
      <router-link
        to="/search"
        class="inline-block px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-xs"
      >
        เริ่มสืบค้นงานวิจัย
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBookmarkStore } from '../stores/bookmark';
import ProjectCard from '../components/ProjectCard.vue';

const bookmarkStore = useBookmarkStore();

onMounted(() => {
  bookmarkStore.fetchBookmarks();
});
</script>
