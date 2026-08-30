<template>
  <div class="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col h-full w-full min-h-[600px]">
    <!-- Toolbar -->
    <div class="bg-slate-800/90 border-b border-slate-700/80 px-4 py-2.5 flex items-center justify-between text-white text-xs shrink-0">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          <span>PDF Reader</span>
        </div>
        <span class="text-slate-300 truncate max-w-xs md:max-w-md font-medium">{{ title || 'เอกสารฉบับเต็ม' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Download PDF Button -->
        <a
          :href="pdfUrl"
          @click="onDownloadClick"
          target="_blank"
          download
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-xs transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>ดาวน์โหลด PDF</span>
        </a>

        <!-- Open in New Tab -->
        <a
          :href="pdfUrl"
          target="_blank"
          class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="เปิดในแท็บใหม่"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </div>

    <!-- PDF Viewer Frame / Object -->
    <div class="flex-1 bg-slate-950 relative w-full h-full min-h-[500px]">
      <iframe
        :src="viewerSrc"
        class="w-full h-full border-none absolute inset-0"
        title="PDF Document Viewer"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getBackendBaseUrl } from '@/services/api';

const props = defineProps({
  projectId: {
    type: [Number, String],
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['downloaded']);

const backendBase = getBackendBaseUrl();

const pdfUrl = computed(() => {
  return `${backendBase}/api/projects/${props.projectId}/pdf`;
});

const viewerSrc = computed(() => {
  return `${backendBase}/api/projects/${props.projectId}/pdf#toolbar=1&navpanes=0&scrollbar=1`;
});

const onDownloadClick = () => {
  emit('downloaded', props.projectId);
};
</script>
