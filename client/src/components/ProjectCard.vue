<template>
  <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100/90 dark:border-purple-900/50 p-6 shadow-xs hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
    <!-- Top Recommendation / Semantic Score Pill & Compare Checkbox -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div v-if="project.semantic_score" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 text-xs font-bold">
          <span class="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
          <span>ตรงความหมาย AI: {{ Math.round(project.semantic_score * 100) }}%</span>
        </div>

        <div v-else-if="project.recommendation_score" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-950 dark:to-emerald-950 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>ความตรงใจ AI: {{ Math.round(project.recommendation_score * 100) }}%</span>
        </div>
      </div>

      <!-- Compare Checkbox Trigger -->
      <button
        type="button"
        @click.stop="projectStore.toggleCompare(project.project_id)"
        :class="[
          'px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1',
          projectStore.isCompared(project.project_id)
            ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
            : 'bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        ]"
      >
        <span>{{ projectStore.isCompared(project.project_id) ? '✓' : '+' }}</span>
        <span>เปรียบเทียบ</span>
      </button>
    </div>

    <!-- Project Thumbnail Visual Banner -->
    <router-link :to="`/projects/${project.project_id}`" class="block relative w-full h-36 rounded-2xl overflow-hidden mb-3.5 group/img shadow-2xs border border-purple-100/60 dark:border-purple-900/40">
      <img
        :src="getProjectThumbnail(project)"
        :alt="project.title_th"
        class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
      <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-medium">
        <span class="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs border border-white/20">
          {{ project.faculty_name || 'มรภ.สุรินทร์' }}
        </span>
        <span class="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 backdrop-blur-xs border border-emerald-500/30 font-bold">
          พ.ศ. {{ project.publish_year ? (parseInt(project.publish_year) + 543) : '2567' }}
        </span>
      </div>
    </router-link>

    <!-- Main Content -->
    <div>
      <!-- Document Type Badge & Faculty & Year Badges -->
      <div class="flex flex-wrap items-center justify-between gap-1.5 text-xs text-purple-500 dark:text-purple-400 mb-2.5">
        <div class="flex items-center gap-1.5 flex-wrap">
          <!-- Document Type Badge -->
          <span
            :class="[
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border',
              project.project_type === 'THESIS' ? 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800' :
              project.project_type === 'SENIOR_PROJECT' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800' :
              project.project_type === 'INDEPENDENT_STUDY' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800' :
              project.project_type === 'RESEARCH_ARTICLE' ? 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800' :
              'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800'
            ]"
          >
            <span>{{ getDocTypeIcon(project.project_type) }}</span>
            <span>{{ getDocTypeLabel(project.project_type) }}</span>
          </span>

          <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-transparent dark:border-slate-700">
            {{ project.faculty_name || 'คณะวิทยาศาสตร์และเทคโนโลยี' }}
          </span>
        </div>

        <span class="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 text-[11px]">
          พ.ศ. {{ project.publish_year ? (parseInt(project.publish_year) + 543) : '2567' }}
        </span>
      </div>

      <!-- Title TH -->
      <router-link :to="`/projects/${project.project_id}`" class="block">
        <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {{ project.title_th }}
        </h3>
      </router-link>

      <!-- Title EN -->
      <p v-if="project.title_en" class="text-xs text-purple-600 dark:text-purple-300/80 italic line-clamp-1 mb-3 font-normal">
        {{ project.title_en }}
      </p>

      <!-- Abstract Excerpt -->
      <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed font-light">
        {{ project.abstract_text }}
      </p>

      <!-- Keywords -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="(kw, idx) in splitKeywords(project.keywords)"
          :key="idx"
          class="px-2.5 py-0.5 text-[11px] rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold"
        >
          #{{ kw }}
        </span>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="pt-4 border-t border-purple-50 dark:border-purple-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div class="space-y-0.5">
        <div class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
          {{ project.authors }}
        </div>
        <div class="text-[11px] text-purple-600 dark:text-purple-300">
          ที่ปรึกษา: {{ project.advisor_name }}
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- Bookmark Button -->
        <button
          @click.stop="toggleBookmark"
          class="p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          :title="isBookmarked ? 'ลบออกจากรายการที่บันทึก' : 'บันทึกงานวิจัย'"
        >
          <svg
            :class="['w-5 h-5', isBookmarked ? 'fill-current text-purple-600 dark:text-purple-400' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
        </button>

        <!-- View Detail Button -->
        <router-link
          :to="`/projects/${project.project_id}`"
          class="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all shadow-2xs group-hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBookmarkStore } from '../stores/bookmark';
import { useAuthStore } from '../stores/auth';
import { useProjectStore } from '../stores/project';
import { useRouter } from 'vue-router';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const bookmarkStore = useBookmarkStore();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const router = useRouter();

const isBookmarked = computed(() => {
  return bookmarkStore.isBookmarked(props.project.project_id);
});

const getDocTypeLabel = (type) => {
  const map = {
    THESIS: 'วิทยานิพนธ์',
    SENIOR_PROJECT: 'โปรเจกต์จบ',
    INDEPENDENT_STUDY: 'ค้นคว้าอิสระ (IS)',
    RESEARCH_ARTICLE: 'บทความวิจัย',
    RESEARCH_REPORT: 'รายงานวิจัยสถาบัน'
  };
  return map[type] || 'วิทยานิพนธ์';
};

const getDocTypeIcon = (type) => {
  const map = {
    THESIS: '🎓',
    SENIOR_PROJECT: '💻',
    INDEPENDENT_STUDY: '📖',
    RESEARCH_ARTICLE: '📑',
    RESEARCH_REPORT: '🏢'
  };
  return map[type] || '📄';
};

const splitKeywords = (kwStr) => {
  if (!kwStr) return [];
  return kwStr.split(/[,،]+/).map(k => k.trim()).filter(k => k.length > 0).slice(0, 3);
};

const getProjectThumbnail = (p) => {
  if (!p) return '/images/hero_banner.jpg';
  if (p.cover_image_path) return p.cover_image_path;
  if (p.author_image_path) return p.author_image_path;
  if (p.project_id === 1 || (p.title_th && (p.title_th.includes('แนะนำ') || p.title_th.includes('สืบค้น')))) {
    return '/images/project_nlp.jpg';
  }
  if (p.project_id === 2 || (p.title_th && (p.title_th.includes('ข้าว') || p.title_th.includes('เกษตร')))) {
    return '/images/project_rice.jpg';
  }
  if (p.project_id === 3 || (p.title_th && (p.title_th.includes('ไหม') || p.title_th.includes('ผ้า')))) {
    return '/images/project_silk.jpg';
  }
  if (p.project_id === 4 || (p.title_th && (p.title_th.includes('ท่องเที่ยว') || p.title_th.includes('ปราสาท') || p.title_th.includes('GIS')))) {
    return '/images/project_gis.jpg';
  }
  return '/images/hero_banner.jpg';
};

const toggleBookmark = async () => {
  if (!authStore.isAuthenticated) {
    if (confirm('กรุณาเข้าสู่ระบบเพื่อบันทึกงานวิจัย')) {
      router.push('/login');
    }
    return;
  }
  await bookmarkStore.toggleBookmark(props.project.project_id);
};
</script>
