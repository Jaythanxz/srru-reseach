<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-8 sm:p-10 shadow-xl space-y-8">
      <!-- Header -->
      <div class="border-b border-purple-50 dark:border-purple-900/40 pb-6 space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Student Thesis & Project Submission</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">ส่งผลงานวิจัย / โครงงานวิทยานิพนธ์และโปรเจกต์จบ</h1>
        <p class="text-xs sm:text-sm text-purple-700 dark:text-purple-300/80">
          กรอกรายละเอียดผลงานและอัปโหลดเอกสารฉบับเต็ม (.PDF) ระบบ AI จะช่วยตรวจจับความซ้ำซ้อนของหัวข้อวิจัยแบบเรียลไทม์
        </p>
      </div>

      <!-- Real-Time AI Redundancy Radar / Alert Bar -->
      <div
        v-if="redundancyResult && (form.title_th || form.abstract_text)"
        :class="[
          'p-5 rounded-3xl border transition-all duration-300 space-y-3',
          redundancyResult.risk_level === 'HIGH'
            ? 'bg-rose-50/90 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            : redundancyResult.risk_level === 'MODERATE'
            ? 'bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            : 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">
              {{ redundancyResult.risk_level === 'HIGH' ? '⚠️' : redundancyResult.risk_level === 'MODERATE' ? '💡' : '✅' }}
            </span>
            <div class="font-bold text-xs sm:text-sm">
              ผลการตรวจจับความซ้ำซ้อน AI (Topic Redundancy Check):
              <span class="font-black underline">{{ redundancyResult.highest_similarity }}% Similarity</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider',
                redundancyResult.risk_level === 'HIGH' ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200' :
                redundancyResult.risk_level === 'MODERATE' ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200' : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
              ]"
            >
              {{ redundancyResult.risk_level === 'HIGH' ? 'ความซ้ำซ้อนสูง' : redundancyResult.risk_level === 'MODERATE' ? 'ปานกลาง' : 'แปลกใหม่ ปลอดภัย' }}
            </span>

            <!-- Print Certificate Button -->
            <button
              type="button"
              @click="showCertificateModal = true"
              class="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-black border border-slate-300 dark:border-slate-600 transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>📜</span>
              <span>พิมพ์ใบรับรอง (Certificate)</span>
            </button>
          </div>
        </div>

        <p class="text-xs leading-relaxed opacity-90">
          {{ redundancyResult.risk_message }}
        </p>

        <!-- Matched Existing Papers -->
        <div v-if="redundancyResult.top_matches && redundancyResult.top_matches.length > 0" class="pt-2 border-t border-black/5 dark:border-white/10 space-y-1.5">
          <div class="text-[11px] font-bold opacity-80">ผลงานเดิมในคลังที่ตรวจพบความคล้ายคลึง:</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="m in redundancyResult.top_matches"
              :key="m.project_id"
              class="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-black/5 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 space-y-1"
            >
              <div class="font-bold line-clamp-1 text-[11px]">📄 {{ m.title_th }}</div>
              <div class="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>พ.ศ. {{ (m.publish_year ? parseInt(m.publish_year) : 2024) + 543 }} • {{ m.faculty_name }}</span>
                <span class="font-bold text-purple-700 dark:text-purple-300">คล้าย {{ m.similarity_percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submission Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Document Type Selector -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ประเภทของเอกสาร (Document Type) <span class="text-rose-500">*</span></label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              v-for="type in docTypes"
              :key="type.value"
              @click="form.project_type = type.value"
              :class="[
                'p-3 rounded-2xl border text-left transition-all flex items-center gap-2',
                form.project_type === type.value
                  ? 'bg-purple-100/80 dark:bg-purple-900/80 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-100 font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
              ]"
            >
              <span class="text-base">{{ type.icon }}</span>
              <div>
                <div class="font-bold">{{ type.label }}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{{ type.desc }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Thai Title -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ชื่อเรื่องภาษาไทย (Thai Title) <span class="text-rose-500">*</span></label>
          <input
            v-model="form.title_th"
            @input="triggerRedundancyCheck"
            required
            type="text"
            placeholder="ระบุชื่อเรื่องโครงงานวิจัยภาษาไทย..."
            class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <!-- English Title -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ชื่อเรื่องภาษาอังกฤษ (English Title)</label>
          <input
            v-model="form.title_en"
            @input="triggerRedundancyCheck"
            type="text"
            placeholder="ระบุชื่อเรื่องโครงงานวิจัยภาษาอังกฤษ (ถ้ามี)..."
            class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <!-- Faculty and Department -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">คณะ / วิทยาลัย <span class="text-rose-500">*</span></label>
            <select
              v-model="form.faculty_id"
              @change="form.department_id = ''"
              required
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white"
            >
              <option value="" disabled>เลือกคณะ</option>
              <option v-for="f in projectStore.faculties" :key="f.faculty_id" :value="f.faculty_id">
                {{ f.faculty_name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">สาขาวิชา / ภาควิชา <span class="text-rose-500">*</span></label>
            <select
              v-model="form.department_id"
              required
              :disabled="availableDepartments.length === 0"
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white disabled:opacity-50"
            >
              <option value="" disabled>เลือกสาขาวิชา</option>
              <option v-for="d in availableDepartments" :key="d.department_id" :value="d.department_id">
                {{ d.department_name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Authors, Advisor, Publish Year -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1.5 sm:col-span-1">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ผู้จัดทำ / ผู้วิจัย <span class="text-rose-500">*</span></label>
            <input
              v-model="form.authors"
              required
              type="text"
              placeholder="เช่น นายสมชาย ใจดี"
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div class="space-y-1.5 sm:col-span-1">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">อาจารย์ที่ปรึกษา <span class="text-rose-500">*</span></label>
            <input
              v-model="form.advisor_name"
              required
              type="text"
              placeholder="เช่น ผศ.ดร. ประเสริฐ สกุลดี"
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div class="space-y-1.5 sm:col-span-1">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ปีที่สำเร็จการศึกษา <span class="text-rose-500">*</span></label>
            <select
              v-model="form.publish_year"
              required
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white"
            >
              <option value="2024">2024 (พ.ศ. 2567)</option>
              <option value="2023">2023 (พ.ศ. 2566)</option>
              <option value="2022">2022 (พ.ศ. 2565)</option>
              <option value="2021">2021 (พ.ศ. 2564)</option>
            </select>
          </div>
        </div>

        <!-- Abstract -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">บทคัดย่อ (Abstract) <span class="text-rose-500">*</span></label>
            <span class="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">AI จะตรวจจับความคล้ายคลึงแบบเรียลไทม์</span>
          </div>
          <textarea
            v-model="form.abstract_text"
            @input="triggerRedundancyCheck"
            required
            rows="5"
            placeholder="พิมพ์หรือคัดลอกบทคัดย่อภาษาไทยฉบับสมบูรณ์..."
            class="w-full text-xs sm:text-sm p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 leading-relaxed"
          ></textarea>
        </div>

        <!-- Keywords -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">คำสำคัญ (Keywords) <span class="text-rose-500">*</span></label>
          <input
            v-model="form.keywords"
            @input="triggerRedundancyCheck"
            required
            type="text"
            placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น ปัญญาประดิษฐ์, ระบบแนะนำ, ข้าวหอมมะลิ"
            class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <!-- 📷 Author Photo & Research Cover Image Upload Zone -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>📷 รูปภาพผู้วิจัย / ภาพหน้าปกงานวิจัย (Author Photo & Cover Art)</span>
              <span class="text-[10px] text-purple-600 dark:text-purple-400 font-normal">(ไม่บังคับ - แนะนำให้อัปโหลดเพื่อความสวยงาม)</span>
            </label>
            <span v-if="selectedImage" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              ✓ เลือกรูปภาพแล้ว
            </span>
          </div>

          <div
            v-if="!selectedImage"
            @dragover.prevent="isDraggingImg = true"
            @dragleave.prevent="isDraggingImg = false"
            @drop.prevent="handleImageDrop"
            :class="[
              'border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer',
              isDraggingImg ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/70' : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-purple-50/30 dark:bg-purple-950/30'
            ]"
            @click="$refs.imageInput.click()"
          >
            <input
              ref="imageInput"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              class="hidden"
              @change="handleImageSelect"
            />
            <div class="space-y-2">
              <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-200 mx-auto flex items-center justify-center font-bold text-xl">
                📷
              </div>
              <div class="text-xs text-slate-600 dark:text-slate-300">
                <span class="font-bold text-purple-700 dark:text-purple-300">คลิกเพื่ออัปโหลดรูปผู้วิจัย หรือภาพหน้าปกโครงงาน</span> หรือลากไฟล์ภาพมาวางที่นี่
                <p class="text-[11px] text-purple-500 dark:text-purple-400 mt-1">รองรับไฟล์ภาพ JPG, PNG, WEBP ขนาดไม่เกิน 10 MB</p>
              </div>
            </div>
          </div>

          <!-- Image Preview Card -->
          <div v-else class="p-4 rounded-3xl bg-purple-50/60 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <img :src="selectedImage.preview" class="w-16 h-16 rounded-2xl object-cover border-2 border-purple-300 shadow-sm" />
              <div class="space-y-0.5 text-xs">
                <div class="font-bold text-slate-900 dark:text-white">{{ selectedImage.name }}</div>
                <div class="text-[11px] text-purple-600 dark:text-purple-400">{{ (selectedImage.size / 1024).toFixed(1) }} KB</div>
                <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✨ รูปภาพพร้อมใช้งานสำหรับหน้าปกและโปรไฟล์ผู้วิจัย</div>
              </div>
            </div>
            <button
              type="button"
              @click="removeSelectedImage"
              class="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs transition-colors"
            >
              ✕ ลบรูปภาพ
            </button>
          </div>
        </div>

        <!-- PDF Upload Zone -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ไฟล์เอกสารฉบับเต็ม (.PDF) <span class="text-rose-500">*</span></label>
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer',
              isDragging ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/70' : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-purple-50/30 dark:bg-purple-950/30'
            ]"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".pdf,application/pdf"
              class="hidden"
              @change="handleFileSelect"
            />
            <div class="space-y-2">
              <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-200 mx-auto flex items-center justify-center font-bold">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <div v-if="selectedFile" class="text-xs">
                <p class="font-bold text-purple-900 dark:text-purple-200">{{ selectedFile.name }}</p>
                <p class="text-purple-500 dark:text-purple-400">{{ (selectedFile.size / (1024 * 1024)).toFixed(2) }} MB</p>
              </div>
              <div v-else class="text-xs text-slate-600 dark:text-slate-300">
                <span class="font-bold text-purple-700 dark:text-purple-300">คลิกเพื่อเลือกไฟล์</span> หรือลากไฟล์ PDF มาวางที่นี่
                <p class="text-[11px] text-purple-500 dark:text-purple-400 mt-1">รองรับเฉพาะไฟล์ .PDF ขนาดไม่เกิน 50 MB</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="pt-4 border-t border-purple-50 dark:border-purple-900/40 flex items-center justify-end gap-3">
          <router-link
            to="/"
            class="px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            ยกเลิก
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-emerald-600 hover:from-purple-600 hover:to-emerald-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <span v-if="submitting">กำลังส่งผลงาน...</span>
            <span v-else>ส่งผลงานวิจัยเข้าสู่ระบบ</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Official Redundancy Certificate Modal -->
    <RedundancyCertificateModal
      :is-open="showCertificateModal"
      :project-data="certificateData"
      :similarity-score="redundancyResult ? redundancyResult.highest_similarity : 0"
      @close="showCertificateModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../stores/project';
import api from '../services/api';
import RedundancyCertificateModal from '../components/RedundancyCertificateModal.vue';

const showCertificateModal = ref(false);

const router = useRouter();
const projectStore = useProjectStore();

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const submitting = ref(false);
const redundancyResult = ref(null);

const docTypes = [
  { value: 'THESIS', label: 'วิทยานิพนธ์', icon: '🎓', desc: 'ระดับ ป.โท / ป.เอก' },
  { value: 'SENIOR_PROJECT', label: 'โปรเจกต์จบ', icon: '💻', desc: 'ระดับปริญญาตรี' },
  { value: 'INDEPENDENT_STUDY', label: 'ค้นคว้าอิสระ (IS)', icon: '📖', desc: 'การศึกษาเฉพาะเรื่อง' },
  { value: 'RESEARCH_ARTICLE', label: 'บทความวิจัย', icon: '📑', desc: 'ผลงานตีพิมพ์วิชาการ' },
  { value: 'RESEARCH_REPORT', label: 'รายงานวิจัยสถาบัน', icon: '🏢', desc: 'ทุนวิจัยคณะ/มรภ.' }
];

const form = reactive({
  title_th: '',
  title_en: '',
  project_type: 'THESIS',
  faculty_id: 1,
  department_id: 1,
  authors: '',
  advisor_name: 'ผศ.ดร. ประเสริฐ สกุลดี',
  publish_year: 2024,
  abstract_text: '',
  keywords: ''
});

const availableDepartments = computed(() => {
  if (!form.faculty_id) return [];
  const faculty = projectStore.faculties.find(f => f.faculty_id === parseInt(form.faculty_id));
  return faculty ? faculty.departments : [];
});

const certificateData = computed(() => {
  const faculty = projectStore.faculties.find(f => f.faculty_id === parseInt(form.faculty_id));
  const dept = availableDepartments.value.find(d => d.department_id === parseInt(form.department_id));
  return {
    title_th: form.title_th || 'ยังไม่ได้ระบุชื่อเรื่อง',
    title_en: form.title_en || '',
    authors: form.authors || 'นักศึกษาผู้เสนอหัวข้อ',
    advisor_name: form.advisor_name || 'อาจารย์ที่ปรึกษา',
    faculty_name: faculty ? faculty.faculty_name : 'มหาวิทยาลัยราชภัฏสุรินทร์',
    department_name: dept ? dept.department_name : '',
    project_type: form.project_type || 'THESIS'
  };
});

let debounceTimer = null;
const triggerRedundancyCheck = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    if (!form.title_th && !form.abstract_text) {
      redundancyResult.value = null;
      return;
    }
    try {
      const res = await api.post('/projects/check-redundancy', {
        title_th: form.title_th,
        title_en: form.title_en,
        abstract_text: form.abstract_text,
        keywords: form.keywords
      });
      redundancyResult.value = res;
    } catch (err) {
      console.warn('Redundancy check error:', err);
    }
  }, 350);
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
  } else {
    alert('กรุณาเลือกไฟล์เอกสารรูปแบบ .PDF เท่านั้น');
  }
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
  } else {
    alert('กรุณาเลือกไฟล์เอกสารรูปแบบ .PDF เท่านั้น');
  }
};

const imageInput = ref(null);
const selectedImage = ref(null);
const isDraggingImg = ref(false);

const handleImageSelect = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพเท่านั้นครับ (JPG, PNG, WEBP)');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    selectedImage.value = {
      file,
      name: file.name,
      size: file.size,
      preview: event.target.result
    };
  };
  reader.readAsDataURL(file);
};

const handleImageDrop = (e) => {
  isDraggingImg.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพเท่านั้นครับ (JPG, PNG, WEBP)');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    selectedImage.value = {
      file,
      name: file.name,
      size: file.size,
      preview: event.target.result
    };
  };
  reader.readAsDataURL(file);
};

const removeSelectedImage = () => {
  selectedImage.value = null;
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('title_th', form.title_th);
    formData.append('title_en', form.title_en);
    formData.append('project_type', form.project_type);
    formData.append('faculty_id', form.faculty_id);
    formData.append('department_id', form.department_id);
    formData.append('authors', form.authors);
    formData.append('advisor_name', form.advisor_name);
    formData.append('publish_year', form.publish_year);
    formData.append('abstract_text', form.abstract_text);
    formData.append('keywords', form.keywords);

    if (selectedFile.value) {
      formData.append('pdf_file', selectedFile.value);
    }
    if (selectedImage.value) {
      formData.append('cover_image', selectedImage.value.file);
    }

    await projectStore.submitProject(formData);
    alert('ส่งผลงานวิจัยเข้าสู่ระบบสำเร็จ สถานะปัจจุบัน: รอการอนุมัติโดยอาจารย์ที่ปรึกษา');
    router.push('/');
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถส่งผลงานได้'}`);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  projectStore.fetchFaculties();
});
</script>
