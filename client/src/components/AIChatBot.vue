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
        <div class="text-[10px] text-purple-200 font-light hidden xs:block">ถามได้ทุกเรื่อง • Gemini AI</div>
      </div>
    </button>

    <!-- Chat Dialog Box (Responsive on mobile screen) -->
    <div
      v-if="isOpen"
      class="w-[calc(100vw-32px)] xs:w-[380px] sm:w-[440px] h-[540px] sm:h-[600px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-purple-800 via-purple-700 to-emerald-700 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 flex items-center justify-center text-base sm:text-lg shadow-inner">
            🤖
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>AI ผู้ช่วยวิจัย SRRU</span>
              <span
                :class="[
                  'px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase',
                  activeSource === 'gemini' ? 'bg-emerald-400 text-emerald-950' : 'bg-purple-300 text-purple-950'
                ]"
              >
                {{ activeSource === 'gemini' ? '⚡ GEMINI AI' : 'ONLINE' }}
              </span>
            </h3>
            <p class="text-[10px] sm:text-[11px] text-purple-200">ถามตอบงานวิจัย ระเบียบวิธี & คู่มือระบบ</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Reset Chat Button -->
          <button
            @click="resetChat"
            title="ล้างการสนทนา"
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
          >
            🔄
          </button>
          <!-- Close Button -->
          <button
            @click="isOpen = false"
            title="ปิดหน้าต่าง"
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Quick Suggestion Prompts -->
      <div class="bg-purple-50/70 dark:bg-slate-800/80 border-b border-purple-100 dark:border-purple-900/40 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
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
              'max-w-[86%] p-3 sm:p-3.5 rounded-2xl leading-relaxed shadow-2xs space-y-2',
              msg.sender === 'user'
                ? 'bg-purple-700 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-purple-100 dark:border-slate-700 rounded-tl-none'
            ]"
          >
            <!-- Formatted Markdown Content -->
            <div v-html="formatMessage(msg.text)" class="prose prose-xs dark:prose-invert max-w-none space-y-1.5 leading-relaxed break-words"></div>

            <!-- Model/Source Tag -->
            <div v-if="msg.source && msg.sender === 'ai'" class="text-[9px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 pt-1 border-t border-purple-50 dark:border-slate-700/60">
              <span>{{ msg.source === 'gemini' ? '⚡ ขับเคลื่อนโดย Google Gemini AI' : '💡 SRRU Academic Knowledge Engine' }}</span>
            </div>

            <!-- Recommendation Project Cards if any -->
            <div v-if="msg.recommendedProjects && msg.recommendedProjects.length > 0" class="pt-2 border-t border-purple-100/80 dark:border-slate-700 space-y-1.5">
              <div class="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase flex items-center gap-1">
                <span>📄 งานวิจัยที่เกี่ยวข้องในคลัง มรภ.สุรินทร์:</span>
              </div>
              <router-link
                v-for="p in msg.recommendedProjects"
                :key="p.project_id"
                :to="`/projects/${p.project_id}`"
                @click="isOpen = false"
                class="block p-2.5 rounded-xl bg-purple-50/70 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-purple-950/80 border border-purple-100 dark:border-slate-700 transition-colors text-left group"
              >
                <div class="font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 text-[11px] line-clamp-1">
                  {{ p.title_th }}
                </div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between items-center">
                  <span>{{ p.faculty_name || 'มรภ.สุรินทร์' }} (พ.ศ. {{ (p.publish_year ? parseInt(p.publish_year) : 2024) + 543 }})</span>
                  <span class="font-bold text-emerald-700 dark:text-emerald-300 group-hover:translate-x-0.5 transition-transform">อ่านเอกสาร ›</span>
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
          <div class="bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-2xs">
            <span class="text-[11px] text-purple-600 dark:text-purple-300 font-medium animate-pulse">กำลังประมวลผลคำตอบ...</span>
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <form @submit.prevent="handleSend" class="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-purple-900/40 flex items-center gap-2">
        <input
          v-model="inputQuery"
          type="text"
          placeholder="พิมพ์คำถาม เช่น วิธีส่งเล่ม, Hybrid Rec คืออะไร, ข้าวหอมมะลิ..."
          class="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-purple-50/50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white placeholder-purple-400 dark:placeholder-slate-500"
        />
        <button
          type="submit"
          :disabled="!inputQuery.trim() || isTyping"
          class="p-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-emerald-600 hover:opacity-90 disabled:opacity-50 text-white font-bold transition-all shadow-sm"
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
const activeSource = ref('gemini');

const quickPrompts = [
  { label: '🌾 ข้าวหอมมะลิสุรินทร์', text: 'มีงานวิจัยเกี่ยวกับข้าวหอมมะลิสุรินทร์หรือการเกษตรไหม' },
  { label: '📝 วิธีส่งเล่มวิจัย', text: 'ขั้นตอนการส่งงานวิจัยและการอนุมัติของอาจารย์ทำอย่างไร' },
  { label: '🤖 Hybrid Rec คืออะไร', text: 'ระบบแนะนำงานวิจัยแบบ Hybrid Recommendation และ Thai NLP ทำงานอย่างไร' },
  { label: '💡 แนะนำหัวข้อโปรเจกต์', text: 'ช่วยแนะนำหัวข้อโปรเจกต์จบและวิทยานิพนธ์ที่น่าสนใจสำหรับนักศึกษาหน่อย' },
  { label: '👥 สิทธิ์แต่ละบทบาท', text: 'ระบบมีบทบาทอะไรบ้าง และนักศึกษากับอาจารย์มีสิทธิ์ทำอะไรได้บ้าง' },
  { label: '📖 โครงสร้าง 5 บท', text: 'รายงานโครงงานวิจัย 5 บทมีหัวข้ออะไรบ้างและเขียนอย่างไร' }
];

const welcomeMessage = {
  sender: 'ai',
  text: 'สวัสดีครับ! ผมคือ **AI ผู้ช่วยวิจัยอัจฉริยะ มรภ.สุรินทร์** 🤖✨\n\nสามารถพิมพ์ถามได้ทุกเรื่อง ทั้ง:\n* 🔍 **สืบค้นงานวิจัย & บทคัดย่อ** ในคลัง มรภ.สุรินทร์\n* 📝 **วิธีส่งเล่มวิจัย & ตรวจอนุมัติ** ในระบบ\n* 💡 **ไอเดียหัวข้อโปรเจกต์จบ** & คำแนะนำวิชาการ\n* 🧠 **ทฤษฎี AI & สถิติ** (Hybrid Recommendation, Thai NLP, F1-score)\n\nหรือคลิกหัวข้อด่วนด้านบนได้เลยครับ!',
  source: 'gemini',
  time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
};

const messages = ref([welcomeMessage]);

const resetChat = () => {
  messages.value = [{
    ...welcomeMessage,
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }];
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const formatMessage = (text) => {
  if (!text) return '';
  let html = text;

  // Escape basic HTML
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Markdown Headers: ### Heading -> <h4>, ## Heading -> <h3>
  html = html.replace(/^### (.*$)/gim, '<h4 class="font-bold text-purple-700 dark:text-purple-300 text-xs mt-2 mb-1">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="font-bold text-purple-800 dark:text-purple-200 text-xs mt-2.5 mb-1">$1</h3>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-900 dark:text-purple-200">$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Code inline: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-purple-100 dark:bg-slate-700 text-purple-800 dark:text-purple-200 text-[10px] font-mono">$1</code>');

  // Bullet lists: * item or - item
  html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, '<li class="ml-3 list-disc text-slate-700 dark:text-slate-300">$1</li>');

  // Numbered lists: 1. item
  html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div class="flex gap-1.5 ml-1"><span class="font-bold text-purple-600 dark:text-purple-400">$1.</span><span>$2</span></div>');

  // Newlines to <br/>
  html = html.replace(/\n/g, '<br/>');

  return html;
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
    // Send conversation context to backend Gemini & Knowledge endpoint
    const historyPayload = messages.value.slice(-6).map(m => ({
      sender: m.sender,
      text: m.text
    }));

    const res = await api.post('/chat', {
      message: text,
      history: historyPayload
    });

    const data = res.data || {};
    activeSource.value = data.source || 'gemini';

    messages.value.push({
      sender: 'ai',
      text: data.text || 'ผมได้รับคำถามแล้วครับ แต่ไม่สามารถประมวลผลคำตอบได้ชั่วคราว กรุณาลองใหม่อีกครั้งครับ',
      recommendedProjects: data.recommendedProjects || [],
      source: data.source,
      model: data.model,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    console.error('Chat error:', err);
    messages.value.push({
      sender: 'ai',
      text: 'ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI กรุณาลองใหม่อีกครั้ง',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
