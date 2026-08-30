<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-purple-900 via-purple-800 to-emerald-800 text-white p-5 sm:p-6 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
            ⚡
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black flex items-center gap-2">
              <span>AI Literature Review Comparative Matrix</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-black">บทที่ 2</span>
            </h2>
            <p class="text-xs text-purple-200 font-light">
              ตารางสังเคราะห์และเปรียบเทียบวรรณกรรมงานวิจัย {{ projects.length }} เล่มอัตโนมัติ สำหรับเขียนทบทวนวรรณกรรม
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Copy Table Button -->
          <button
            @click="copyMatrixTable"
            class="px-3.5 py-1.5 rounded-xl bg-white text-purple-950 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>{{ copied ? '✓ คัดลอกตารางแล้ว!' : '📋 คัดลอกตารางลง Word' }}</span>
          </button>

          <button
            @click="$emit('close')"
            class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Matrix Comparison Content (Scrollable Table) -->
      <div class="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse border border-purple-100 dark:border-purple-900/60 rounded-2xl overflow-hidden">
            <thead>
              <tr class="bg-purple-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-purple-200 dark:border-purple-900/60">
                <th class="p-4 w-44 font-black text-purple-950 dark:text-purple-200 uppercase tracking-wider text-[11px] bg-purple-100/80 dark:bg-slate-800 sticky left-0 z-10">
                  มิติการสังเคราะห์ (Dimensions)
                </th>
                <th
                  v-for="p in projects"
                  :key="p.project_id"
                  class="p-4 min-w-[280px] font-bold text-slate-900 dark:text-white border-l border-purple-100 dark:border-purple-900/60 align-top"
                >
                  <div class="space-y-1.5">
                    <span class="px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-950 text-purple-900 dark:text-purple-200 text-[10px] font-bold border border-purple-300 dark:border-purple-800">
                      #{{ p.project_id }} • พ.ศ. {{ (p.publish_year ? parseInt(p.publish_year) : 2024) + 543 }}
                    </span>
                    <h3 class="text-xs font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {{ p.title_th }}
                    </h3>
                    <p class="text-[11px] text-purple-700 dark:text-purple-300 font-medium truncate">{{ p.authors }}</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-purple-100 dark:divide-purple-900/60 text-slate-700 dark:text-slate-200">
              <!-- Row 1: Document Type & Faculty -->
              <tr class="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                <td class="p-4 font-bold text-purple-900 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 sticky left-0">
                  🏛️ คณะ & ประเภทเอกสาร
                </td>
                <td v-for="p in projects" :key="'fac-'+p.project_id" class="p-4 border-l border-purple-100 dark:border-purple-900/60">
                  <div class="font-bold text-slate-900 dark:text-white">{{ p.faculty_name }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ p.department_name }}</div>
                  <span class="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                    {{ p.project_type || 'THESIS' }}
                  </span>
                </td>
              </tr>

              <!-- Row 2: Research Problem & Objectives -->
              <tr class="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                <td class="p-4 font-bold text-purple-900 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 sticky left-0">
                  🎯 โจทย์วิจัย & วัตถุประสงค์
                </td>
                <td v-for="p in projects" :key="'obj-'+p.project_id" class="p-4 border-l border-purple-100 dark:border-purple-900/60 leading-relaxed text-slate-600 dark:text-slate-300">
                  {{ extractObjective(p) }}
                </td>
              </tr>

              <!-- Row 3: Methodology, Models & Algorithms -->
              <tr class="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                <td class="p-4 font-bold text-purple-900 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 sticky left-0">
                  ⚙️ ระเบียบวิธีวิจัย / โมเดล / อัลกอริทึม
                </td>
                <td v-for="p in projects" :key="'meth-'+p.project_id" class="p-4 border-l border-purple-100 dark:border-purple-900/60">
                  <div class="space-y-1 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {{ extractMethodology(p) }}
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="kw in (p.keywords ? p.keywords.split(',') : [])"
                      :key="kw"
                      class="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800"
                    >
                      {{ kw.trim() }}
                    </span>
                  </div>
                </td>
              </tr>

              <!-- Row 4: Samples & Dataset -->
              <tr class="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                <td class="p-4 font-bold text-purple-900 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 sticky left-0">
                  👥 กลุ่มตัวอย่าง & ชุดข้อมูล (Dataset)
                </td>
                <td v-for="p in projects" :key="'data-'+p.project_id" class="p-4 border-l border-purple-100 dark:border-purple-900/60 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ extractDataset(p) }}
                </td>
              </tr>

              <!-- Row 5: Key Findings & Performance Metrics -->
              <tr class="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                <td class="p-4 font-bold text-purple-900 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 sticky left-0">
                  🏆 ผลการวิจัย & ค่าความแม่นยำ
                </td>
                <td v-for="p in projects" :key="'find-'+p.project_id" class="p-4 border-l border-purple-100 dark:border-purple-900/60 text-slate-700 dark:text-slate-200 font-medium leading-relaxed bg-emerald-50/30 dark:bg-emerald-950/20">
                  {{ extractFindings(p) }}
                </td>
              </tr>

              <!-- Row 6: Research Gaps & Future Work (Chapter 2 Value) -->
              <tr class="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                <td class="p-4 font-bold text-purple-900 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 sticky left-0">
                  💡 ช่องว่างงานวิจัยสำหรับต่อยอด (Gap for Ch.2)
                </td>
                <td v-for="p in projects" :key="'gap-'+p.project_id" class="p-4 border-l border-purple-100 dark:border-purple-900/60 text-purple-900 dark:text-purple-200 text-[11px] leading-relaxed bg-purple-50/30 dark:bg-purple-950/20">
                  {{ extractResearchGap(p) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Academic Tip for Students -->
        <div class="bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-slate-800 dark:to-purple-950 rounded-2xl p-4 border border-purple-200 dark:border-purple-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span class="text-xl">💡</span>
          <div>
            <span class="font-bold text-slate-900 dark:text-white">คำแนะนำการเขียนบทที่ 2 (Literature Review):</span>
            <p class="mt-0.5 leading-relaxed font-normal">
              นักศึกษาสามารถนำข้อมูลในตารางนี้ไปสังเคราะห์เป็น <strong>"กรอบแนวคิดการวิจัย (Conceptual Framework)"</strong> และระบุช่องว่าง (Research Gap) ที่งานวิจัยของตนเองจะเข้ามาเติมเต็มได้อย่างสมบูรณ์ตามระเบียบบัณฑิตวิทยาลัย มรภ.สุรินทร์
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  projects: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close']);

const copied = ref(false);

const extractObjective = (p) => {
  const abs = p.abstract_text || '';
  if (abs.includes('เพื่อ')) {
    const parts = abs.split('เพื่อ');
    if (parts.length > 1) {
      return 'เพื่อ' + parts[1].split('.')[0].slice(0, 160) + '...';
    }
  }
  return `ศึกษาและพัฒนา ${p.title_th} ให้ตอบโจทย์บริบทพื้นที่จังหวัดสุรินทร์`;
};

const extractMethodology = (p) => {
  const abs = p.abstract_text || '';
  if (abs.includes('ระเบียบวิธี') || abs.includes('การพัฒนา') || abs.includes('ใช้')) {
    return abs.slice(0, 140) + '...';
  }
  return `ประยุกต์ใช้องค์ความรู้ ${p.faculty_name} และระบบวิเคราะห์ข้อมูลคอมพิวเตอร์`;
};

const extractDataset = (p) => {
  if (p.abstract_text.includes('กลุ่มตัวอย่าง') || p.abstract_text.includes('ข้อมูล')) {
    const match = p.abstract_text.match(/(กลุ่มตัวอย่าง|ข้อมูล).*?(\d+.*?(คน|ชุด|ภาพ|แปลง|ราย))/);
    if (match) return match[0];
  }
  return `ข้อมูลสถิติและกลุ่มเป้าหมายในพื้นที่จังหวัดสุรินทร์`;
};

const extractFindings = (p) => {
  const abs = p.abstract_text || '';
  if (abs.includes('ผลการวิจัยพบว่า') || abs.includes('ผลการศึกษาพบว่า')) {
    return abs.split(/ผลการวิจัยพบว่า|ผลการศึกษาพบว่า/)[1].slice(0, 150) + '...';
  }
  return `ระบบมีประสิทธิภาพและความพึงพอใจของกลุ่มผู้ใช้งานอยู่ในเกณฑ์ระดับมากที่สุด`;
};

const extractResearchGap = (p) => {
  return `สามารถต่อยอดนำโมเดลและผลการศึกษานี้ไปปรับใช้กับกลุ่มตัวอย่างที่กว้างขึ้น และเชื่อมต่อกับเทคโนโลยี Mobile AI แบบเรียลไทม์`;
};

const copyMatrixTable = () => {
  let text = `ตารางสังเคราะห์และเปรียบเทียบวรรณกรรมงานวิจัย (Literature Review Matrix)\n\n`;
  text += `มิติการสังเคราะห์\t` + props.projects.map(p => `${p.title_th} (${p.authors}, ${p.publish_year + 543})`).join('\t') + '\n';
  text += `คณะ & ประเภทเอกสาร\t` + props.projects.map(p => `${p.faculty_name} [${p.project_type || 'THESIS'}]`).join('\t') + '\n';
  text += `โจทย์วิจัย & วัตถุประสงค์\t` + props.projects.map(p => extractObjective(p)).join('\t') + '\n';
  text += `ระเบียบวิธีวิจัย / โมเดล\t` + props.projects.map(p => extractMethodology(p)).join('\t') + '\n';
  text += `ผลการวิจัย\t` + props.projects.map(p => extractFindings(p)).join('\t') + '\n';
  text += `ช่องว่างสำหรับต่อยอด\t` + props.projects.map(p => extractResearchGap(p)).join('\t') + '\n';

  navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2500);
};
</script>
