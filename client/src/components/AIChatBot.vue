<template>
  <!-- Floating AI Assistant Chatbot Button & Dialog (Bottom-Right & Mobile-Optimized) -->
  <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
    <!-- Chat Trigger Button -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="group flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-purple-700 via-purple-600 to-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/80"
    >
      <div class="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20">
        <span class="text-sm sm:text-base">✨</span>
        <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-pulse"></span>
      </div>
      <div class="text-left pr-1">
        <div class="text-xs font-bold tracking-tight">AI ผู้ช่วยวิจัย SRRU</div>
        <div class="text-[10px] text-purple-200 font-light hidden xs:block">ถามหาหัวข้อ & คำแนะนำ</div>
      </div>
    </button>

    <!-- Chat Dialog Box (Responsive on mobile screen) -->
    <div
      v-if="isOpen"
      class="w-[calc(100vw-32px)] xs:w-[360px] sm:w-[420px] h-[520px] sm:h-[560px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-purple-800 to-emerald-700 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 flex items-center justify-center text-base sm:text-lg shadow-inner">
            🤖
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>AI ผู้ช่วยสืบค้นงานวิจัย</span>
              <span class="px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950 text-[9px] font-black">ONLINE</span>
            </h3>
            <p class="text-[10px] sm:text-[11px] text-purple-200">คลังวิจัย มรภ.สุรินทร์ (SRRU)</p>
          </div>
        </div>

        <button
          @click="isOpen = false"
          class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Quick Suggestion Prompts -->
      <div class="bg-purple-50/70 dark:bg-slate-800/80 border-b border-purple-100 dark:border-purple-900/40 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <button
          v-for="(p, idx) in quickPrompts"
          :key="idx"
          @click="sendMessage(p.text)"
          class="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 hover:border-purple-400 text-purple-800 dark:text-purple-200 font-medium transition-all shadow-2xs hover:bg-purple-50 dark:hover:bg-purple-900"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Messages Area -->
      <div ref="messageContainer" class="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['flex gap-2.5', msg.sender === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div
            v-if="msg.sender === 'ai'"
            class="w-7 h-7 rounded-xl bg-purple-600 text-white flex-shrink-0 flex items-center justify-center text-xs shadow-xs"
          >
            🤖
          </div>

          <div
            :class="[
              'max-w-[84%] p-3 sm:p-3.5 rounded-2xl leading-relaxed shadow-2xs space-y-1.5',
              msg.sender === 'user'
                ? 'bg-purple-700 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-purple-100 dark:border-slate-700 rounded-tl-none'
            ]"
          >
            <div v-html="msg.text" class="leading-relaxed"></div>

            <!-- Recommendation Project Cards if any -->
            <div v-if="msg.recommendedProjects && msg.recommendedProjects.length > 0" class="pt-2 border-t border-purple-100/80 dark:border-slate-700 space-y-1.5">
              <div class="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">📄 งานวิจัยที่ตรงกับคำถาม:</div>
              <router-link
                v-for="p in msg.recommendedProjects"
                :key="p.project_id"
                :to="`/projects/${p.project_id}`"
                @click="isOpen = false"
                class="block p-2 rounded-xl bg-purple-50/70 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-purple-950/80 border border-purple-100 dark:border-slate-700 transition-colors text-left group"
              >
                <div class="font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 text-[11px] line-clamp-1">
                  {{ p.title_th }}
                </div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex justify-between items-center">
                  <span>{{ p.faculty_name }} (พ.ศ. {{ (p.publish_year ? parseInt(p.publish_year) : 2024) + 543 }})</span>
                  <span class="font-bold text-emerald-700 dark:text-emerald-300">คลิกอ่านเอกสาร ›</span>
                </div>
              </router-link>
            </div>

            <div :class="['text-[9px] mt-1 text-right', msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400 dark:text-slate-500']">
              {{ msg.time }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex gap-2.5 justify-start">
          <div class="w-7 h-7 rounded-xl bg-purple-600 text-white flex-shrink-0 flex items-center justify-center text-xs">
            🤖
          </div>
          <div class="bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-2xs">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <form @submit.prevent="handleSend" class="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-purple-900/40 flex items-center gap-2">
        <input
          v-model="inputQuery"
          type="text"
          placeholder="พิมพ์คำถาม เช่น แนะนำงานวิจัยข้าวหอมมะลิ..."
          class="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white placeholder-purple-400 dark:placeholder-slate-500"
        />
        <button
          type="submit"
          :disabled="!inputQuery.trim() || isTyping"
          class="p-2.5 rounded-xl bg-purple-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import api from '../services/api';

const isOpen = ref(false);
const inputQuery = ref('');
const isTyping = ref(false);
const messageContainer = ref(null);

const quickPrompts = [
  { label: '🌾 ข้าวหอมมะลิ', text: 'มีงานวิจัยเกี่ยวกับข้าวหอมมะลิสุรินทร์หรือการเกษตรไหม' },
  { label: '🧵 ผ้าไหมสุรินทร์', text: 'ค้นหางานวิจัยด้านการตลาดผ้าไหมสุรินทร์' },
  { label: '🤖 AI & ระบบแนะนำ', text: 'แนะนำงานวิจัยด้าน AI และระบบแนะนำภาษาไทย' },
  { label: '💡 ไอเดียโปรเจกต์จบ', text: 'ช่วยแนะนำหัวข้อโปรเจกต์จบที่น่าสนใจสำหรับนักศึกษาหน่อย' }
];

const messages = ref([
  {
    sender: 'ai',
    text: 'สวัสดีครับ! ผมคือ <strong>AI ผู้ช่วยสืบค้นคลังวิจัย มรภ.สุรินทร์</strong> 🤖<br/>พิมพ์สอบถามหัวข้อวิจัย ค้นหางานที่เกี่ยวข้อง หรือคลิกเลือกหัวข้อด่วนด้านบนได้เลยครับ',
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }
]);

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const handleSend = () => {
  if (!inputQuery.value.trim()) return;
  const q = inputQuery.value;
  inputQuery.value = '';
  sendMessage(q);
};

const sendMessage = async (text) => {
  messages.value.push({
    sender: 'user',
    text: text,
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  });
  scrollToBottom();

  isTyping.value = true;

  try {
    const res = await api.get('/projects', { params: { mode: 'semantic', keyword: text, limit: 3 } });
    const matched = res.data || [];

    let aiReply = '';
    const qLower = text.toLowerCase();

    if (qLower.includes('สวัสดี') || qLower.includes('ดีครับ') || qLower.includes('หวัดดี')) {
      aiReply = 'สวัสดีครับ! ผมพร้อมช่วยคุณสืบค้นงานวิจัย แนะนำหัวข้อโปรเจกต์จบ หรือสรุปบทคัดย่อในคลัง มรภ.สุรินทร์ ครับ มีหัวข้อไหนที่สนใจเป็นพิเศษไหมครับ?';
    } else if (qLower.includes('ไอเดีย') || qLower.includes('แนะนำหัวข้อ') || qLower.includes('โปรเจกต์จบ')) {
      aiReply = `💡 <strong>แนวทางการต่อยอดโครงงานวิจัยบัณฑิตศึกษา & โปรเจกต์จบ มรภ.สุรินทร์:</strong><br/>
1. <strong>AI & Smart Agriculture</strong>: การประยุกต์ใช้โมเดล Deep Learning จำแนกโรคพืชและคาดการณ์ผลผลิตข้าวหอมมะลิ<br/>
2. <strong>Digital Local Economy</strong>: ระบบแนะนำสินค้าภูมิปัญญาท้องถิ่นผ้าไหมสุรินทร์ด้วย Hybrid Recommendation Engine<br/>
3. <strong>IoT Smart Environment</strong>: โรงเรือนเกษตรอัจฉริยะควบคุมผ่านแอปพลิเคชันมือถือ<br/><br/>
นี่คืองานวิจัยที่สามารถนำไปใช้อ้างอิงเป็นงานวิจัยที่เกี่ยวข้อง (Literature Review) ครับ:`;
    } else if (matched.length > 0) {
      aiReply = `จากการวิเคราะห์เชิงความหมาย (Dense Semantic AI) ในคลัง มรภ.สุรินทร์ ผมพบผลงานวิจัยที่ตรงกับคำถามของคุณ <strong>${matched.length} รายการ</strong> ดังนี้ครับ:`;
    } else {
      aiReply = 'ผมได้ทำการสืบค้นในคลังวิจัยแล้ว แต่ยังไม่พบงานที่ตรงแบบเจาะจง คุณสามารถลองเปลี่ยนคำสำคัญ เช่น *ข้าวหอมมะลิ*, *ปัญญาประดิษฐ์*, *ผ้าไหม*, หรือเข้าไปที่หน้า **สืบค้นงานวิจัย** เพื่อใช้ตัวกรองแบบละเอียดได้ครับ';
    }

    messages.value.push({
      sender: 'ai',
      text: aiReply,
      recommendedProjects: matched,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    messages.value.push({
      sender: 'ai',
      text: 'ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};
</script>
