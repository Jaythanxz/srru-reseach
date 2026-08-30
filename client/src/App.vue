<template>
  <div class="min-h-screen flex flex-col bg-[#faf8fd] dark:bg-[#0b0713] font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-purple-600 selection:text-white transition-colors duration-300">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />

    <!-- Floating Literature Review Comparison Action Bar -->
    <div
      v-if="projectStore.comparedIds.length > 0"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-5 py-3.5 rounded-full shadow-2xl border border-purple-500/40 backdrop-blur-md flex items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="text-xs sm:text-sm font-bold">
          เลือกเปรียบเทียบ {{ projectStore.comparedIds.length }} / 3 เล่ม
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showCompareModal = true"
          :disabled="projectStore.comparedIds.length < 2"
          class="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 disabled:opacity-50 text-white font-black text-xs transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>⚡</span>
          <span>{{ projectStore.comparedIds.length >= 2 ? 'เปิดตารางสังเคราะห์ AI' : 'เลือกอีก 1 เล่ม' }}</span>
        </button>

        <button
          @click="projectStore.clearCompare"
          class="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors font-medium"
        >
          ล้าง
        </button>
      </div>
    </div>

    <!-- AI Literature Review Comparative Matrix Modal -->
    <ComparativeMatrixModal
      :is-open="showCompareModal"
      :projects="projectStore.comparedProjects"
      @close="showCompareModal = false"
    />

    <!-- AI Assistant Chatbot Floating Widget (Bottom-Right) -->
    <AIChatBot />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProjectStore } from './stores/project';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import AIChatBot from './components/AIChatBot.vue';
import ComparativeMatrixModal from './components/ComparativeMatrixModal.vue';

const projectStore = useProjectStore();
const showCompareModal = ref(false);
</script>
