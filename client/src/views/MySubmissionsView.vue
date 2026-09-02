<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-purple-100/80 via-white to-emerald-50/80 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-6 sm:p-8 border border-purple-100/90 dark:border-purple-800/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
          <span>Student Submissions & Revision Center</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ผลงานวิจัยของฉัน
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          ติดตามสถานะการพิจารณา ตรวจสอบข้อเสนอแนะจากอาจารย์ที่ปรึกษา และแก้ไขส่งผลงานใหม่
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link
          to="/submit"
          class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-emerald-600 hover:from-purple-600 hover:to-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 hover:scale-105"
        >
          <span>➕</span>
          <span>ส่งผลงานใหม่</span>
        </router-link>

        <button
          @click="fetchMyProjects"
          class="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all shadow-2xs"
          title="รีเฟรชข้อมูล"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>
    </div>

    <!-- Alert Banner when there are REJECTED projects -->
    <div v-if="rejectedCount > 0" class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/60 dark:to-amber-950/40 border-2 border-rose-300 dark:border-rose-800 shadow-xs flex items-start gap-3.5 animate-in fade-in duration-300">
      <div class="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs">
        ⚠️
      </div>
      <div class="flex-1 space-y-1">
        <h3 class="text-sm font-bold text-rose-900 dark:text-rose-200">
          คุณมี {{ rejectedCount }} โครงงานที่อาจารย์ส่งกลับเพื่อขอให้แก้ไขเพิ่มเติม
        </h3>
        <p class="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
          กรุณาอ่านข้อเสนอแนะของอาจารย์ที่ปรึกษาที่ระบุไว้ในการ์ดผลงานด้านล่าง แล้วกดปุ่ม <strong>"แก้ไขและส่งใหม่อีกครั้ง"</strong> เพื่อให้อาจารย์พิจารณาซ้ำครับ
        </p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap items-center gap-2 border-b border-purple-100 dark:border-purple-900/40 pb-3">
      <button
        type="button"
        @click="activeFilter = 'all'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
          activeFilter === 'all'
            ? 'bg-purple-800 text-white shadow-xs'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-purple-100 dark:border-slate-700'
        ]"
      >
        <span>ทั้งหมด</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeFilter === 'all' ? 'bg-purple-900 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
          {{ projects.length }}
        </span>
      </button>

      <button
        type="button"
        @click="activeFilter = 'REJECTED'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
          activeFilter === 'REJECTED'
            ? 'bg-rose-600 text-white shadow-xs'
            : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50'
        ]"
      >
        <span>⚠️ ส่งกลับแก้ไข</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-black">
          {{ rejectedCount }}
        </span>
      </button>

      <button
        type="button"
        @click="activeFilter = 'PENDING'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
          activeFilter === 'PENDING'
            ? 'bg-amber-600 text-white shadow-xs'
            : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50'
        ]"
      >
        <span>⏳ รอการตรวจสอบ</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-black">
          {{ pendingCount }}
        </span>
      </button>

      <button
        type="button"
        @click="activeFilter = 'APPROVED'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
          activeFilter === 'APPROVED'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50'
        ]"
      >
        <span>✅ อนุมัติแล้ว</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-black">
          {{ approvedCount }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16 space-y-3">
      <div class="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-500 dark:text-slate-400">กำลังโหลดผลงานของคุณ...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProjects.length === 0" class="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/40 p-8 space-y-4">
      <div class="text-4xl">📂</div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">ไม่พบรายการผลงานในหมวดนี้</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">คุณสามารถส่งผลงานวิจัยหรือโปรเจกต์จบเข้าสู่ระบบได้ตลอดเวลา</p>
      <router-link
        to="/submit"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors"
      >
        <span>➕ ส่งผลงานวิจัยใหม่</span>
      </router-link>
    </div>

    <!-- Projects List -->
    <div v-else class="space-y-6">
      <div
        v-for="item in filteredProjects"
        :key="item.project_id"
        :class="[
          'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border shadow-xs transition-all space-y-5',
          item.status === 'REJECTED'
            ? 'border-rose-300 dark:border-rose-900/70 shadow-rose-100/50 dark:shadow-none'
            : item.status === 'APPROVED'
            ? 'border-emerald-200 dark:border-emerald-900/40'
            : 'border-amber-200 dark:border-amber-900/40'
        ]"
      >
        <!-- Top Status & Meta Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-2.5 flex-wrap">
            <!-- Status Badge -->
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs',
                item.status === 'REJECTED'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800 animate-pulse'
                  : item.status === 'APPROVED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800'
              ]"
            >
              <span>{{ item.status === 'REJECTED' ? '⚠️ ส่งกลับแก้ไข' : (item.status === 'APPROVED' ? '✅ อนุมัติแล้ว' : '⏳ รอการตรวจสอบ') }}</span>
            </span>

            <span class="text-xs font-bold text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-900">
              {{ item.project_type || 'THESIS' }}
            </span>

            <span class="text-xs text-slate-500 dark:text-slate-400">
              {{ item.faculty_name }} • {{ item.department_name }}
            </span>
          </div>

          <div class="text-[11px] text-slate-400 dark:text-slate-500">
            อัปเดตล่าสุด: {{ formatDate(item.updated_at || item.created_at) }}
          </div>
        </div>

        <!-- Title & Abstract -->
        <div class="space-y-2">
          <router-link
            :to="`/projects/${item.project_id}`"
            class="text-lg font-bold text-slate-900 dark:text-white hover:text-purple-700 dark:hover:text-purple-400 transition-colors block"
          >
            {{ item.title_th }}
          </router-link>

          <p v-if="item.title_en" class="text-xs italic text-slate-500 dark:text-slate-400 font-light">
            {{ item.title_en }}
          </p>

          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-normal leading-relaxed pt-1">
            {{ item.abstract_text }}
          </p>
        </div>

        <!-- 🔴🔴 REJECTION FEEDBACK ALERT BOX (Highlights Teacher's Notes) 🔴🔴 -->
        <div
          v-if="item.status === 'REJECTED'"
          class="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 space-y-2"
        >
          <div class="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-200">
            <span class="flex items-center gap-1.5">
              <span>✍️</span>
              <span>ข้อเสนอแนะและสิ่งที่ต้องปรับปรุงจากอาจารย์:</span>
            </span>
            <span class="text-[11px] font-normal text-rose-600 dark:text-rose-300">
              โดย: {{ item.approver_name || item.advisor_name || 'อาจารย์ที่ปรึกษา' }}
            </span>
          </div>

          <div class="text-xs sm:text-sm text-rose-900 dark:text-rose-100 font-medium leading-relaxed bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-inner">
            "{{ item.rejection_reason || 'โปรดปรับปรุงเอกสารให้ถูกต้องตามระเบียบวิจัยและคำแนะนำของอาจารย์' }}"
          </div>

          <div class="flex items-center justify-end pt-1">
            <button
              type="button"
              @click="openEditModal(item)"
              class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-105"
            >
              <span>✏️</span>
              <span>แก้ไขข้อมูลและส่งใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>

        <!-- Approved Success Box -->
        <div
          v-else-if="item.status === 'APPROVED'"
          class="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-200"
        >
          <span class="flex items-center gap-1.5">
            <span>🎉</span>
            <span>ผลงานนี้ได้รับการอนุมัติเรียบร้อย และเผยแพร่สู่คลังงานวิจัยสาธารณะแล้ว</span>
          </span>
          <router-link
            :to="`/projects/${item.project_id}`"
            class="font-bold underline text-emerald-700 dark:text-emerald-300 hover:text-emerald-900"
          >
            ดูผลงานในคลัง →
          </router-link>
        </div>

        <!-- Bottom Actions Row -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>อาจารย์ที่ปรึกษา: <strong class="text-slate-700 dark:text-slate-300">{{ item.advisor_name }}</strong></span>
            <span>ปี พ.ศ.: <strong class="text-slate-700 dark:text-slate-300">{{ item.publish_year + 543 }}</strong></span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openEditModal(item)"
              class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-1"
            >
              <span>✏️ แก้ไขข้อมูล</span>
            </button>

            <router-link
              :to="`/projects/${item.project_id}`"
              class="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold transition-colors flex items-center gap-1"
            >
              <span>📄 เปิดดูเล่มฉบับเต็ม</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit & Resubmit Modal Dialog -->
    <div v-if="editingProject" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-200 dark:border-purple-800 space-y-6 my-8 animate-in fade-in zoom-in-95">
        <div class="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/50 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">✏️</span>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-base">แก้ไขและส่งผลงานวิจัยใหม่อีกครั้ง</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">ปรับปรุงเนื้อหาตามข้อเสนอแนะของอาจารย์ที่ปรึกษา</p>
            </div>
          </div>
          <button @click="editingProject = null" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold">✕</button>
        </div>

        <form @submit.prevent="saveAndResubmit" class="space-y-4 text-xs text-left">
          <!-- Title TH -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">ชื่อเรื่อง (ภาษาไทย) *</label>
            <input
              v-model="editForm.title_th"
              type="text"
              required
              class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <!-- Title EN -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">ชื่อเรื่อง (ภาษาอังกฤษ)</label>
            <input
              v-model="editForm.title_en"
              type="text"
              class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <!-- Abstract Text -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">บทคัดย่อ (Abstract) *</label>
            <textarea
              v-model="editForm.abstract_text"
              rows="4"
              required
              class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none leading-relaxed"
            ></textarea>
          </div>

          <!-- Keywords & Authors -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">คำสำคัญ (Keywords) *</label>
              <input
                v-model="editForm.keywords"
                type="text"
                required
                class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">อาจารย์ที่ปรึกษา *</label>
              <input
                v-model="editForm.advisor_name"
                type="text"
                required
                class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- File upload (PDF) -->
          <div class="space-y-1 pt-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">อัปโหลดไฟล์ PDF ฉบับแก้ไขใหม่ (ถ้ามี)</label>
            <input
              type="file"
              accept=".pdf"
              @change="handleFileChange"
              class="w-full p-2 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-slate-600 dark:text-slate-300"
            />
            <p class="text-[10px] text-slate-400">หากไม่อัปโหลดใหม่ ระบบจะใช้ไฟล์เดิม</p>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              @click="editingProject = null"
              class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-emerald-600 hover:from-purple-600 hover:to-emerald-500 text-white font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>{{ saving ? 'กำลังบันทึก...' : '🚀 บันทึกและส่งให้อาจารย์ตรวจ' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const projects = ref([]);
const loading = ref(true);
const activeFilter = ref('all');
const editingProject = ref(null);
const saving = ref(false);
const newPdfFile = ref(null);

const editForm = ref({
  title_th: '',
  title_en: '',
  abstract_text: '',
  keywords: '',
  authors: '',
  advisor_name: ''
});

const rejectedCount = computed(() => projects.value.filter(p => p.status === 'REJECTED').length);
const pendingCount = computed(() => projects.value.filter(p => p.status === 'PENDING').length);
const approvedCount = computed(() => projects.value.filter(p => p.status === 'APPROVED').length);

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value;
  return projects.value.filter(p => p.status === activeFilter.value);
});

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const fetchMyProjects = async () => {
  loading.value = true;
  try {
    const res = await api.get('/user/my-projects');
    projects.value = res.data || [];
  } catch (err) {
    console.error('Fetch my projects error:', err);
  } finally {
    loading.value = false;
  }
};

const openEditModal = (p) => {
  editingProject.value = p;
  newPdfFile.value = null;
  editForm.value = {
    title_th: p.title_th || '',
    title_en: p.title_en || '',
    abstract_text: p.abstract_text || '',
    keywords: p.keywords || '',
    authors: p.authors || '',
    advisor_name: p.advisor_name || ''
  };
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    newPdfFile.value = e.target.files[0];
  }
};

const saveAndResubmit = async () => {
  if (!editingProject.value) return;
  saving.value = true;
  try {
    const formData = new FormData();
    formData.append('title_th', editForm.value.title_th);
    formData.append('title_en', editForm.value.title_en);
    formData.append('abstract_text', editForm.value.abstract_text);
    formData.append('keywords', editForm.value.keywords);
    formData.append('advisor_name', editForm.value.advisor_name);
    if (newPdfFile.value) {
      formData.append('pdf_file', newPdfFile.value);
    }

    // Set annotations / mark resubmitted
    formData.append('annotations', 'นักศึกษาได้แก้ไขข้อมูลและส่งเข้ามาใหม่อีกครั้ง');

    await api.put(`/projects/${editingProject.value.project_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Change status back to PENDING so teacher can re-review
    try {
      await api.patch(`/approvals/${editingProject.value.project_id}/status`, {
        status: 'PENDING',
        rejection_reason: null
      });
    } catch (e) {
      // ignore
    }

    alert('บันทึกและส่งผลงานฉบับแก้ไขให้อาจารย์ที่ปรึกษาเรียบร้อยแล้ว!');
    editingProject.value = null;
    await fetchMyProjects();
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึก: ' + (err.message || 'Server Error'));
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchMyProjects();
});
</script>
