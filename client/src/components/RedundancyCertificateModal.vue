<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Modal Top Action Bar (Hidden on print) -->
      <div class="print:hidden bg-gradient-to-r from-purple-900 via-purple-800 to-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shadow-inner">
            📜
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-black">
              ใบรับรองผลการตรวจความซ้ำซ้อนของหัวข้อวิจัย (Certificate of Originality)
            </h2>
            <p class="text-[11px] text-purple-200">มหาวิทยาลัยราชภัฏสุรินทร์ • Surindra Rajabhat University</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Print Button -->
          <button
            type="button"
            @click="handlePrint"
            class="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-purple-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
          >
            <span>🖨️</span>
            <span>สั่งพิมพ์ / บันทึก PDF</span>
          </button>

          <button
            type="button"
            @click="$emit('close')"
            class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Printable Certificate Body (A4 Format) -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-12 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible print:m-0 print:text-black">
        <div id="certificate-print-area" class="max-w-2xl mx-auto border-2 border-slate-800 p-8 sm:p-10 rounded-2xl relative space-y-6 print:border-2 print:border-black print:p-8 print:shadow-none shadow-sm">
          <!-- Decorative Top Seal Border -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4">
            <span class="text-[10px] font-black tracking-widest text-slate-400 uppercase">OFFICIAL VERIFICATION CERTIFICATE</span>
          </div>

          <!-- University Header -->
          <div class="text-center space-y-2 border-b-2 border-slate-800 pb-5">
            <!-- SRRU Emblem Representation -->
            <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-800 via-indigo-700 to-emerald-600 p-1 flex items-center justify-center shadow-xs">
              <div class="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span class="font-black text-xs text-purple-900 tracking-tighter">SRRU</span>
              </div>
            </div>

            <div class="space-y-0.5">
              <h1 class="text-base sm:text-lg font-black tracking-tight text-slate-900">
                มหาวิทยาลัยราชภัฏสุรินทร์ (SURINDRA RAJABHAT UNIVERSITY)
              </h1>
              <p class="text-xs font-bold text-slate-700">
                สำนักวิทยบริการและเทคโนโลยีสารสนเทศ • บัณฑิตวิทยาลัย
              </p>
              <p class="text-[11px] text-slate-500">
                ระบบคลังงานวิจัยดิจิทัลและการตรวจสอบความซ้ำซ้อนด้วยปัญญาประดิษฐ์ (AI Originality Engine)
              </p>
            </div>

            <div class="pt-2">
              <span class="inline-block px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-black text-slate-800">
                ใบรับรองผลการตรวจสอบความซ้ำซ้อนของหัวข้อวิจัยและวิทยานิพนธ์
              </span>
            </div>
          </div>

          <!-- Document Metadata Info -->
          <div class="grid grid-cols-2 text-xs border-b border-slate-200 pb-3 gap-2">
            <div>
              <span class="font-bold text-slate-600">รหัสเอกสารรับรอง:</span>
              <span class="font-mono font-bold text-slate-900 ml-1">SRRU-VERIFY-{{ verificationCode }}</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-slate-600">วันที่ตรวจสอบ:</span>
              <span class="font-bold text-slate-900 ml-1">{{ formattedDate }}</span>
            </div>
          </div>

          <!-- Project Information -->
          <div class="space-y-3 text-xs leading-relaxed">
            <div>
              <span class="font-bold text-slate-600 block">ชื่อเรื่องงานวิจัย / โครงงาน (ภาษาไทย):</span>
              <span class="font-bold text-sm text-slate-900 block mt-0.5">{{ projectData.title_th || 'ไม่ระบุชื่อเรื่อง' }}</span>
            </div>

            <div v-if="projectData.title_en">
              <span class="font-bold text-slate-600 block">Title (English):</span>
              <span class="italic text-slate-700 block mt-0.5">{{ projectData.title_en }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <span class="font-bold text-slate-600">ผู้จัดทำ / ผู้วิจัย:</span>
                <span class="font-bold text-slate-900 ml-1">{{ projectData.authors || 'นักศึกษาผู้เสนอหัวข้อ' }}</span>
              </div>
              <div>
                <span class="font-bold text-slate-600">อาจารย์ที่ปรึกษา:</span>
                <span class="font-bold text-slate-900 ml-1">{{ projectData.advisor_name || 'อาจารย์ที่ปรึกษาโครงงาน' }}</span>
              </div>
              <div>
                <span class="font-bold text-slate-600">คณะ / หน่วยงาน:</span>
                <span class="font-bold text-slate-900 ml-1">{{ projectData.faculty_name || 'มหาวิทยาลัยราชภัฏสุรินทร์' }}</span>
              </div>
              <div>
                <span class="font-bold text-slate-600">ประเภทผลงาน:</span>
                <span class="font-bold text-slate-900 ml-1">{{ projectData.project_type || 'วิทยานิพนธ์ / โครงงานวิจัย' }}</span>
              </div>
            </div>
          </div>

          <!-- AI Similarity & Redundancy Result Box -->
          <div class="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-black text-slate-800 text-xs uppercase tracking-wider">
                ผลการวิเคราะห์ความซ้ำซ้อนด้วยปัญญาประดิษฐ์ (AI Analysis Result):
              </span>
              <span
                :class="[
                  'px-3 py-1 rounded-full font-black text-xs',
                  similarityScore < 40 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                  similarityScore < 70 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-rose-100 text-rose-900 border border-rose-300'
                ]"
              >
                {{ similarityScore < 40 ? '✓ ผ่านเกณฑ์ (APPROVED - SAFE)' : similarityScore < 70 ? '⚠️ ปานกลาง (MODERATE)' : '🔴 ซ้ำซ้อนสูง (HIGH RISK)' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 items-center">
              <div class="space-y-1">
                <div class="text-[11px] text-slate-500 font-bold">ดัชนีความซ้ำซ้อน (Similarity Index):</div>
                <div class="text-2xl font-black text-slate-900">{{ similarityScore }}%</div>
                <div class="text-[10px] text-slate-500">Thai NLP Tokenizer & Cosine Similarity</div>
              </div>
              <div class="text-[11px] text-slate-600 leading-relaxed border-l border-slate-200 pl-3">
                <p>
                  {{ similarityScore < 40
                    ? 'หัวข้อวิจัยนี้มีความสดใหม่และมีเอกลักษณ์ตามเกณฑ์มาตรฐานของมหาวิทยาลัยราชภัฏสุรินทร์ สามารถใช้เสนอขออนุมัติโครงร่างวิทยานิพนธ์/โครงงานจบได้'
                    : 'พบเนื้อหาที่มีความใกล้เคียงกับงานวิจัยเดิมในคลังบางส่วน ขอแนะนำให้อาจารย์ที่ปรึกษาพิจารณาขอบเขตเพิ่มเติม' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Signatures & QR Code Section -->
          <div class="grid grid-cols-3 gap-4 pt-6 items-end text-center text-xs border-t border-slate-200">
            <!-- Digital QR Code -->
            <div class="flex flex-col items-center justify-center space-y-1">
              <div class="w-20 h-20 border-2 border-slate-800 rounded-lg p-1 bg-white flex flex-col items-center justify-center shadow-2xs">
                <!-- QR Code Pattern Representation -->
                <div class="w-full h-full bg-slate-900 flex items-center justify-center rounded">
                  <span class="text-white text-[9px] font-mono font-bold text-center leading-tight">SRRU<br/>VERIFY<br/>QR</span>
                </div>
              </div>
              <span class="text-[9px] font-bold text-slate-500">สแกนตรวจสอบข้อมูล</span>
            </div>

            <!-- Student Signature -->
            <div class="space-y-8">
              <div class="border-b border-slate-400 w-36 mx-auto"></div>
              <div class="space-y-0.5">
                <p class="font-bold text-slate-800">({{ projectData.authors || '..................................................' }})</p>
                <p class="text-[10px] text-slate-500">นักศึกษา / ผู้วิจัย</p>
              </div>
            </div>

            <!-- Advisor Signature -->
            <div class="space-y-8">
              <div class="border-b border-slate-400 w-36 mx-auto"></div>
              <div class="space-y-0.5">
                <p class="font-bold text-slate-800">({{ projectData.advisor_name || '..................................................' }})</p>
                <p class="text-[10px] text-slate-500">อาจารย์ที่ปรึกษาโครงงาน</p>
              </div>
            </div>
          </div>

          <!-- Footer Stamp -->
          <div class="text-center pt-2 text-[10px] text-slate-400">
            เอกสารฉบับนี้ออกโดยระบบอัตโนมัติ คลังงานวิจัยดิจิทัล มหาวิทยาลัยราชภัฏสุรินทร์ (SRRU Digital Research Repository)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  projectData: {
    type: Object,
    default: () => ({})
  },
  similarityScore: {
    type: Number,
    default: 15
  }
});

defineEmits(['close']);

const verificationCode = computed(() => {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${new Date().getFullYear()}-${rand}`;
});

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const handlePrint = () => {
  window.print();
};
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #certificate-print-area, #certificate-print-area * {
    visibility: visible;
  }
  #certificate-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    border: 2px solid #000 !important;
  }
}
</style>
