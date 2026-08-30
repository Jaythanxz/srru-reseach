<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Light & Airy Header -->
    <div class="bg-gradient-to-r from-purple-100/80 via-white to-emerald-50/80 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-8 border border-purple-100/90 dark:border-purple-800/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Advisor & Committee Evaluation Portal</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">ระบบตรวจสอบและอนุมัติโครงงานวิจัย</h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          พิจารณา ตรวจสอบเอกสาร PDF ฉบับเต็ม ไฮไลต์และเพิ่มข้อคิดเห็น (PDF Annotation) และอนุมัติผลงานวิจัยของนักศึกษา
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchPending"
          class="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 transition-colors flex items-center gap-2 shadow-2xs"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>รีเฟรชรายการ</span>
        </button>
      </div>
    </div>

    <!-- Data Table Card -->
    <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-xs overflow-hidden">
      <div class="p-6 border-b border-slate-100 dark:border-purple-900/40 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">รายการผลงานที่รอการตรวจสอบ</h2>
          <span class="px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 font-bold text-xs border border-purple-200 dark:border-purple-800">
            {{ pendingList.length }} รายการ
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center text-purple-400 text-xs animate-pulse">
        กำลังโหลดรายการงานวิจัยที่รอการตรวจสอบ...
      </div>

      <!-- Pending List Table -->
      <div v-else-if="pendingList.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th class="px-6 py-4">รหัส / วันที่ส่ง</th>
              <th class="px-6 py-4">ชื่อเรื่องงานวิจัย</th>
              <th class="px-6 py-4">ผู้จัดทำ & อาจารย์ที่ปรึกษา</th>
              <th class="px-6 py-4">คณะ & สาขาวิชา</th>
              <th class="px-6 py-4">สถานะ</th>
              <th class="px-6 py-4 text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="item in pendingList" :key="item.project_id" class="hover:bg-purple-50/30 dark:hover:bg-purple-950/40 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-bold text-purple-900 dark:text-purple-300">#{{ item.project_id }}</span>
                <span class="block text-[11px] text-slate-500 dark:text-slate-400">{{ formatDate(item.created_at) }}</span>
              </td>
              <td class="px-6 py-4 max-w-xs">
                <div class="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{{ item.title_th }}</div>
                <div v-if="item.title_en" class="text-[11px] text-purple-600 dark:text-purple-300/80 italic line-clamp-1 mt-0.5">{{ item.title_en }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800 dark:text-slate-200">{{ item.authors }}</div>
                <div class="text-[11px] text-purple-600 dark:text-purple-300">ที่ปรึกษา: {{ item.advisor_name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-slate-800 dark:text-slate-200 font-medium">{{ item.faculty_name }}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ item.department_name }}</div>
              </td>
              <td class="px-6 py-4">
                <StatusBadge :status="item.status" />
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap space-x-2">
                <!-- Open Interactive Annotation Review Modal -->
                <button
                  @click="openInteractiveReview(item)"
                  class="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold border border-purple-200 dark:border-purple-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>📝</span>
                  <span>ตรวจงาน & คอมเมนต์ PDF</span>
                </button>

                <!-- Quick Approve -->
                <button
                  @click="approveProject(item.project_id)"
                  class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-colors"
                >
                  อนุมัติ
                </button>

                <!-- Reject -->
                <button
                  @click="openRejectModal(item)"
                  class="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 transition-colors"
                >
                  ส่งกลับแก้ไข
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-16 text-center text-slate-400 dark:text-slate-500 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-xl font-bold border border-emerald-200 dark:border-emerald-800">
          ✓
        </div>
        <h3 class="font-bold text-slate-800 dark:text-white text-sm">ไม่มีงานวิจัยที่รอการตรวจสอบในขณะนี้</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">ทุกผลงานได้รับการพิจารณาและอนุมัติเรียบร้อยแล้ว</p>
      </div>
    </div>

    <!-- Interactive PDF Annotation & Review Full Modal -->
    <div v-if="activeReviewItem" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-7xl w-full h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Top Bar (Crisp, High-Contrast Light Theme) -->
        <div class="px-5 py-3.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-emerald-900 text-white flex items-center justify-between shadow-xs border-b border-purple-800">
          <div class="flex items-center gap-3 truncate max-w-2xl">
            <span class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 flex items-center gap-1.5 shrink-0">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ตรวจพิจารณาเอกสาร PDF</span>
            </span>
            <span class="font-bold text-xs sm:text-sm truncate text-white">{{ activeReviewItem.title_th }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="hidden sm:inline-block text-[11px] text-purple-200 font-medium mr-2">
              ผู้เสนอ: {{ activeReviewItem.authors }}
            </span>
            <button
              @click="activeReviewItem = null"
              class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>✕</span>
              <span>ปิดหน้าต่าง</span>
            </button>
          </div>
        </div>

        <!-- Main Modal Content (Split View: PDF Viewer on Left, Annotation Panel on Right) -->
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
          <!-- Left 8 Cols: PDF Document Viewer -->
          <div class="lg:col-span-8 h-full flex flex-col p-2 sm:p-3 overflow-hidden bg-slate-200/70">
            <div class="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-white border border-slate-300">
              <PDFViewer :project-id="activeReviewItem.project_id" :title="activeReviewItem.title_th" />
            </div>
          </div>

          <!-- Right 4 Cols: Interactive Annotation & Comment Panel (Structured flexbox with non-clipping bottom bar) -->
          <div class="lg:col-span-4 h-full bg-white flex flex-col border-l border-purple-100 overflow-hidden">
            <!-- Header section of right column -->
            <div class="p-4 border-b border-slate-100 space-y-1 bg-purple-50/40">
              <h3 class="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <span>📝</span>
                <span>โน้ตข้อเสนอแนะอาจารย์ (Annotations)</span>
              </h3>
              <p class="text-[11px] text-slate-500">บันทึกประเด็นที่ต้องการให้นักศึกษาปรับปรุงแก้ไข</p>
            </div>

            <!-- Scrollable middle content (Inputs + Notes list) -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <!-- Annotation Tag Options -->
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold text-slate-700">แท็กประเภทข้อเสนอแนะ</label>
                <div class="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    @click="newNoteType = 'REVISE'"
                    :class="['py-2 px-1 rounded-xl font-bold border transition-all text-center flex items-center justify-center gap-1', newNoteType === 'REVISE' ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50']"
                  >
                    <span>⚠️</span>
                    <span>ต้องแก้ไข</span>
                  </button>
                  <button
                    type="button"
                    @click="newNoteType = 'FORMAT'"
                    :class="['py-2 px-1 rounded-xl font-bold border transition-all text-center flex items-center justify-center gap-1', newNoteType === 'FORMAT' ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-purple-50']"
                  >
                    <span>📄</span>
                    <span>รูปแบบ/อ้างอิง</span>
                  </button>
                  <button
                    type="button"
                    @click="newNoteType = 'PRAISE'"
                    :class="['py-2 px-1 rounded-xl font-bold border transition-all text-center flex items-center justify-center gap-1', newNoteType === 'PRAISE' ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50']"
                  >
                    <span>👍</span>
                    <span>จุดเด่น</span>
                  </button>
                </div>
              </div>

              <!-- Textarea input -->
              <div class="space-y-2">
                <textarea
                  v-model="newNoteText"
                  rows="3"
                  placeholder="พิมพ์ข้อคิดเห็น เช่น บทคัดย่อยังขาดสถิติกลุ่มตัวอย่าง หรือรูปแบบอ้างอิงยังไม่เป็น APA 7th..."
                  class="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                ></textarea>
                <button
                  type="button"
                  @click="addAnnotationNote"
                  :disabled="!newNoteText.trim()"
                  class="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>+</span>
                  <span>บันทึกโน้ตข้อเสนอแนะ</span>
                </button>
              </div>

              <!-- Saved Notes List -->
              <div class="space-y-2 pt-2 border-t border-slate-100">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>รายการข้อเสนอแนะที่บันทึกแล้ว</span>
                  <span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px]">{{ notesList.length }} รายการ</span>
                </div>

                <div v-if="notesList.length === 0" class="text-center py-6 text-xs text-slate-400 bg-slate-50/80 rounded-2xl border border-slate-100">
                  ยังไม่มีการบันทึกข้อคิดเห็น
                </div>
                <div v-else class="space-y-2 max-h-44 overflow-y-auto pr-1">
                  <div
                    v-for="(note, idx) in notesList"
                    :key="idx"
                    :class="[
                      'p-3 rounded-2xl border text-xs space-y-1 relative group shadow-2xs',
                      note.type === 'REVISE' ? 'bg-amber-50/90 border-amber-200 text-amber-950' :
                      note.type === 'FORMAT' ? 'bg-purple-50/90 border-purple-200 text-purple-950' : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    ]"
                  >
                    <div class="flex items-center justify-between text-[10px] font-bold">
                      <span :class="note.type === 'REVISE' ? 'text-amber-900' : note.type === 'FORMAT' ? 'text-purple-900' : 'text-emerald-900'">
                        {{ note.type === 'REVISE' ? '⚠️ ต้องแก้ไข' : note.type === 'FORMAT' ? '📄 รูปแบบ/อ้างอิง' : '👍 จุดเด่น' }}
                      </span>
                      <button @click="removeNote(idx)" class="text-slate-400 hover:text-rose-600 font-bold">✕ ลบ</button>
                    </div>
                    <p class="text-slate-800 leading-relaxed font-normal">{{ note.text }}</p>
                    <div class="text-[9px] text-slate-400 text-right">{{ note.time }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fixed Bottom Action Bar: Approve / Return (Always Visible, Never Clipped) -->
            <div class="p-4 border-t border-purple-100 bg-slate-50/90 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="approveFromModal"
                  class="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                >
                  <span class="text-sm">✓</span>
                  <span>อนุมัติผลงาน</span>
                </button>
                <button
                  type="button"
                  @click="rejectFromModal"
                  class="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                >
                  <span class="text-sm">↺</span>
                  <span>ส่งกลับพร้อมโน้ต</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="rejectItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 space-y-4">
        <h3 class="text-base font-bold text-slate-900">ระบุเหตุผลและข้อเสนอแนะในการส่งกลับแก้ไข</h3>
        <p class="text-xs text-slate-500">
          ข้อความนี้จะถูกส่งไปยังนักศึกษาผู้ส่งผลงานเพื่อเป็นแนวทางในการปรับปรุงแก้ไข
        </p>

        <textarea
          v-model="rejectionReason"
          required
          rows="4"
          placeholder="ระบุข้อเสนอแนะและสิ่งที่ต้องปรับปรุง..."
          class="w-full text-xs p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800"
        ></textarea>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            @click="rejectItem = null"
            class="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 font-bold"
          >
            ยกเลิก
          </button>
          <button
            @click="confirmReject"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            ยืนยันส่งกลับแก้ไข
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge.vue';
import PDFViewer from '../components/PDFViewer.vue';

const pendingList = ref([]);
const loading = ref(false);
const activeReviewItem = ref(null);
const rejectItem = ref(null);
const rejectionReason = ref('');

// Annotation State
const newNoteType = ref('REVISE');
const newNoteText = ref('');
const notesList = ref([
  {
    type: 'FORMAT',
    text: 'โปรดตรวจสอบการจัดหน้าและรูปแบบการอ้างอิงให้เป็นมาตรฐาน APA 7th Edition',
    time: '10:30 น.'
  }
]);

const fetchPending = async () => {
  loading.value = true;
  try {
    const res = await api.get('/approvals/pending');
    if (res.success) {
      pendingList.value = res.data;
    }
  } catch (err) {
    console.error('Fetch pending error:', err);
  } finally {
    loading.value = false;
  }
};

const openInteractiveReview = (item) => {
  activeReviewItem.value = item;
};

const addAnnotationNote = () => {
  if (!newNoteText.value.trim()) return;
  notesList.value.push({
    type: newNoteType.value,
    text: newNoteText.value.trim(),
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
  });
  newNoteText.value = '';
};

const removeNote = (idx) => {
  notesList.value.splice(idx, 1);
};

const approveProject = async (projectId) => {
  if (!confirm('คุณต้องการอนุมัติผลงานวิจัยนี้เพื่อเผยแพร่สู่คลังดิจิทัลสาธารณะใช่หรือไม่?')) return;
  try {
    await api.patch(`/approvals/${projectId}/status`, { status: 'APPROVED' });
    alert('อนุมัติผลงานวิจัยเรียบร้อยแล้ว');
    fetchPending();
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const approveFromModal = async () => {
  if (!activeReviewItem.value) return;
  await approveProject(activeReviewItem.value.project_id);
  activeReviewItem.value = null;
};

const rejectFromModal = async () => {
  if (!activeReviewItem.value) return;
  const combinedFeedback = notesList.value.map(n => `[${n.type}] ${n.text}`).join('\n');
  try {
    await api.patch(`/approvals/${activeReviewItem.value.project_id}/status`, {
      status: 'REJECTED',
      rejection_reason: combinedFeedback || 'โปรดปรับปรุงเอกสารตามข้อเสนอแนะของอาจารย์ที่ปรึกษา'
    });
    alert('ส่งผลงานกลับให้นักศึกษาแก้ไขพร้อมแนบโน้ตข้อเสนอแนะเรียบร้อยแล้ว');
    activeReviewItem.value = null;
    fetchPending();
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const openRejectModal = (item) => {
  rejectItem.value = item;
  rejectionReason.value = '';
};

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) {
    alert('กรุณาระบุเหตุผลหรือข้อเสนอแนะในการส่งกลับแก้ไข');
    return;
  }
  try {
    await api.patch(`/approvals/${rejectItem.value.project_id}/status`, {
      status: 'REJECTED',
      rejection_reason: rejectionReason.value
    });
    alert('ส่งกลับแก้ไขและบันทึกข้อเสนอแนะเรียบร้อยแล้ว');
    rejectItem.value = null;
    fetchPending();
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchPending();
});
</script>
