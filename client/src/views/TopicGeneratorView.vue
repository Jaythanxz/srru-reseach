<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-purple-100/80 via-white to-emerald-50/80 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-6 sm:p-8 border border-purple-100/90 dark:border-purple-800/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
      <div class="space-y-2 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>SRRU AI Thesis & Capstone Topic Generator</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ระบบ AI ช่วยคิดหัวข้อวิจัยและโปรเจกต์จบ
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          สังเคราะห์โครงร่างวิจัยที่สดใหม่ ไม่ซ้ำซ้อนกับผลงานในคลัง พร้อมระบุวัตถุประสงค์ เทคโนโลยี และอาจารย์ที่ปรึกษาที่เหมาะสม
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-800/60 shadow-2xs text-center">
          <div class="text-xs font-bold text-slate-400 dark:text-slate-500">สถานะ AI Engine</div>
          <div class="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">READY • Thai NLP</div>
        </div>
      </div>
    </div>

    <!-- Generator Form & Quick Presets -->
    <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 sm:p-8 shadow-xs space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Faculty Selector -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">1. คณะ / หน่วยงาน</label>
          <select
            v-model="form.faculty_id"
            @change="onFacultyChange"
            class="w-full text-xs px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
          >
            <option value="">-- เลือกคณะของคุณ --</option>
            <option v-for="f in projectStore.faculties" :key="f.faculty_id" :value="f.faculty_id">
              {{ f.faculty_name }}
            </option>
          </select>
        </div>

        <!-- Degree Level -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">2. ระดับการศึกษา</label>
          <select
            v-model="form.degree_level"
            class="w-full text-xs px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
          >
            <option value="BACHELOR">ปริญญาตรี (Senior Project / โครงงานจบ)</option>
            <option value="MASTER">ปริญญาโท (Master Thesis / วิทยานิพนธ์)</option>
            <option value="DOCTORAL">ปริญญาเอก (Doctoral Dissertation)</option>
          </select>
        </div>

        <!-- Interest Keyword / Area -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">3. สิ่งที่คุณสนใจ / คำสำคัญ</label>
          <input
            v-model="form.keywords"
            type="text"
            placeholder="เช่น ข้าวหอมมะลิ AI, ผ้าไหมสุรินทร์, IoT..."
            class="w-full text-xs px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <!-- Quick Idea Shortcuts -->
      <div class="space-y-2 pt-2 border-t border-purple-50 dark:border-purple-900/40">
        <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">คลิกเลือกแนวคิดยอดนิยมของ มรภ.สุรินทร์:</label>
        <div class="flex flex-wrap gap-2 text-xs">
          <button
            v-for="idea in quickIdeas"
            :key="idea.label"
            @click="selectQuickIdea(idea)"
            class="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/80 hover:bg-emerald-50 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 font-medium transition-all shadow-2xs text-[11px]"
          >
            {{ idea.icon }} {{ idea.label }}
          </button>
        </div>
      </div>

      <!-- Submit Action Button -->
      <div class="pt-4 flex justify-end">
        <button
          type="button"
          @click="generateTopics"
          :disabled="loading"
          class="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-emerald-600 hover:from-purple-700 hover:to-emerald-500 text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span v-else>✨</span>
          <span>{{ loading ? 'AI กำลังวิเคราะห์และสังเคราะห์หัวข้อ...' : 'สังเคราะห์ 3 ร่างหัวข้อวิจัยด้วย AI' }}</span>
        </button>
      </div>
    </div>

    <!-- Generated Proposals Section -->
    <div v-if="proposals.length > 0" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div class="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/50 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">💡</span>
          <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            ร่างโครงร่างวิจัยแนะนำโดย AI ({{ proposals.length }} ข้อเสนอ)
          </h2>
        </div>
        <span class="text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          ✓ ผ่านการตรวจความซ้ำซ้อนเบื้องต้น
        </span>
      </div>

      <!-- Proposal Cards Grid -->
      <div class="grid grid-cols-1 gap-6">
        <div
          v-for="p in proposals"
          :key="p.id"
          class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-600 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden"
        >
          <!-- Top Tag & Originality Badge -->
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-purple-50 dark:border-purple-900/40 pb-3">
            <div class="flex items-center gap-2 text-xs">
              <span class="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 font-bold text-[11px] border border-purple-200 dark:border-purple-800">
                ข้อเสนอที่ #{{ p.id }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] border border-transparent dark:border-slate-700">
                {{ p.degree_type }}
              </span>
            </div>

            <span class="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-1">
              <span>ความสดใหม่ (Originality):</span>
              <span class="font-black text-emerald-700 dark:text-emerald-300">{{ p.originality_score }}%</span>
            </span>
          </div>

          <!-- Titles -->
          <div class="space-y-1.5">
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {{ p.title_th }}
            </h3>
            <p class="text-xs text-purple-600 dark:text-purple-300/80 italic font-medium">
              {{ p.title_en }}
            </p>
          </div>

          <!-- Objectives (3 Bullets) -->
          <div class="space-y-2 bg-purple-50/40 dark:bg-purple-950/40 p-4 sm:p-5 rounded-2xl border border-purple-100/80 dark:border-purple-900/40 text-xs">
            <div class="font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
              <span>🎯</span>
              <span>วัตถุประสงค์การวิจัย (Objectives):</span>
            </div>
            <ul class="space-y-1.5 pl-5 list-disc text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              <li v-for="(obj, idx) in p.objectives" :key="idx">
                {{ obj }}
              </li>
            </ul>
          </div>

          <!-- Technical Specs & Advisor Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase block">⚙️ โมเดล / เทคโนโลยี:</span>
              <span class="font-bold text-slate-800 dark:text-slate-100">{{ p.recommended_tech }}</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase block">👥 แหล่งข้อมูล & กลุ่มตัวอย่าง:</span>
              <span class="text-slate-700 dark:text-slate-200">{{ p.dataset_plan }}</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span class="text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase block">👨‍🏫 อาจารย์ที่ปรึกษาแนะนำ:</span>
              <span class="font-bold text-emerald-950 dark:text-emerald-200">{{ p.suggested_advisor }}</span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="pt-3 border-t border-purple-50 dark:border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              @click="copyProposal(p)"
              class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-1.5"
            >
              <span>{{ copiedId === p.id ? '✓ คัดลอกโครงร่างแล้ว!' : '📋 คัดลอกโครงร่างวิจัย' }}</span>
            </button>

            <router-link
              :to="{ path: '/submit', query: { title: p.title_th, faculty_id: form.faculty_id, advisor: p.suggested_advisor } }"
              class="px-5 py-2 rounded-xl bg-purple-700 hover:bg-emerald-600 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>นำหัวข้อนี้ไปส่งผลงาน ›</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useProjectStore } from '../stores/project';
import api from '../services/api';

const projectStore = useProjectStore();

const form = reactive({
  faculty_id: '1',
  degree_level: 'BACHELOR',
  keywords: ''
});

const proposals = ref([]);
const loading = ref(false);
const copiedId = ref(null);

const quickIdeas = [
  { icon: '🌾', label: 'ข้าวหอมมะลิ & โดรนเกษตรอัจฉริยะ', faculty_id: '2', kw: 'ข้าวหอมมะลิ ตรวจจับโรคพืช โดรน' },
  { icon: '🧵', label: 'ผ้าไหมสุรินทร์ & AR การตลาดเสมือนจริง', faculty_id: '3', kw: 'ผ้าไหมสุรินทร์ การตลาดดิจิทัล AR' },
  { icon: '🤖', label: 'Thai NLP & RAG คลังความรู้วิชาการ', faculty_id: '1', kw: 'ปัญญาประดิษฐ์ Thai NLP RAG' },
  { icon: '🏥', label: 'IoT & AI สุขภาพผู้สูงอายุชนบท', faculty_id: '6', kw: 'IoT ผู้สูงอายุ Computer Vision' }
];

const selectQuickIdea = (idea) => {
  form.faculty_id = idea.faculty_id;
  form.keywords = idea.kw;
  generateTopics();
};

const onFacultyChange = () => {
  proposals.value = [];
};

const generateTopics = async () => {
  loading.value = true;
  proposals.value = [];
  try {
    const res = await api.post('/projects/generate-topics', {
      faculty_id: form.faculty_id,
      degree_level: form.degree_level,
      keywords: form.keywords
    });
    if (res.success) {
      proposals.value = res.proposals || [];
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการสร้างหัวข้อ: ' + err.message);
  } finally {
    loading.value = false;
  }
};

const copyProposal = (p) => {
  const text = `โครงร่างหัวข้อวิจัยแนะนำ (มรภ.สุรินทร์)\n` +
    `ชื่อเรื่อง (TH): ${p.title_th}\n` +
    `ชื่อเรื่อง (EN): ${p.title_en}\n` +
    `ระดับ: ${p.degree_type}\n\n` +
    `วัตถุประสงค์:\n` + p.objectives.map((o, i) => `${i+1}. ${o}`).join('\n') + `\n\n` +
    `เทคโนโลยีแนะนำ: ${p.recommended_tech}\n` +
    `กลุ่มตัวอย่าง/ข้อมูล: ${p.dataset_plan}\n` +
    `อาจารย์ที่ปรึกษาแนะนำ: ${p.suggested_advisor}`;

  navigator.clipboard.writeText(text);
  copiedId.value = p.id;
  setTimeout(() => {
    copiedId.value = null;
  }, 2500);
};

onMounted(async () => {
  await projectStore.fetchFaculties();
  generateTopics();
});
</script>
