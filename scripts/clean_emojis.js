const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../client/src');

// 1. SearchView.vue
const searchPath = path.join(srcDir, 'views/SearchView.vue');
if (fs.existsSync(searchPath)) {
  let c = fs.readFileSync(searchPath, 'utf8');
  c = c.replace('<span>🧠</span>', '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>');
  c = c.replace('<span>🔍</span>', '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>');
  c = c.replace("filters.mode === 'semantic' ? 'โหมด AI ➔' : 'โหมด ตรงตัว 🔍'", "filters.mode === 'semantic' ? 'โหมด AI' : 'โหมด ตรงตัว'");
  c = c.replace('<span>📄</span>', '<svg class="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>');
  c = c.replace('<span class="text-sm">📑</span>', '<svg class="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>');
  c = c.replace('<span>👤 {{ paper.authors }}</span>', '<span>{{ paper.authors }}</span>');
  c = c.replace('เปิดอ่าน ➔', 'เปิดอ่าน &rarr;');
  c = c.replace('<span>🔍</span>\n                  <span>คำแนะนำการค้นหา:</span>', '<svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>\n                  <span>คำแนะนำการค้นหา:</span>');
  c = c.replace('<span class="text-slate-400 text-xs">🔍</span>', '<svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>');
  c = c.replace('<span>🕒</span>\n                    <span>ประวัติการค้นหาล่าสุด:</span>', '<svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>\n                    <span>ประวัติการค้นหาล่าสุด:</span>');
  
  c = c.replace('<option value="THESIS">🎓 วิทยานิพนธ์ (ระดับบัณฑิตศึกษา)</option>', '<option value="THESIS">วิทยานิพนธ์ (ระดับบัณฑิตศึกษา)</option>');
  c = c.replace('<option value="SENIOR_PROJECT">💻 โปรเจกต์จบ (ปริญญาตรี)</option>', '<option value="SENIOR_PROJECT">โปรเจกต์จบ (ปริญญาตรี)</option>');
  c = c.replace('<option value="INDEPENDENT_STUDY">📖 การค้นคว้าอิสระ (IS)</option>', '<option value="INDEPENDENT_STUDY">การค้นคว้าอิสระ (IS)</option>');
  c = c.replace('<option value="RESEARCH_ARTICLE">📑 บทความวิจัย / ผลงานตีพิมพ์</option>', '<option value="RESEARCH_ARTICLE">บทความวิจัย / ผลงานตีพิมพ์</option>');
  c = c.replace('<option value="RESEARCH_REPORT">🏢 รายงานการวิจัยสถาบัน</option>', '<option value="RESEARCH_REPORT">รายงานการวิจัยสถาบัน</option>');

  c = c.replace('<option value="newest">⚡ อัปเดตล่าสุด</option>', '<option value="newest">อัปเดตล่าสุด</option>');
  c = c.replace('<option value="relevance">⭐ ความตรงใจ AI (Relevance)</option>', '<option value="relevance">ความตรงใจ AI (Relevance)</option>');
  c = c.replace('<option value="popular">🔥 ยอดเข้าชมสูงสุด</option>', '<option value="popular">ยอดเข้าชมสูงสุด</option>');
  c = c.replace('<option value="downloads">📥 ยอดดาวน์โหลดสูงสุด</option>', '<option value="downloads">ยอดดาวน์โหลดสูงสุด</option>');
  c = c.replace('<option value="year">📅 ปีพิมพ์ล่าสุด</option>', '<option value="year">ปีพิมพ์ล่าสุด</option>');

  c = c.replace('📑 แยกตามประเภท', 'แยกตามประเภท');
  c = c.replace('<span class="text-xl">{{ group.icon }}</span>', '<span class="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>');
  c = c.replace('<div class="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center text-2xl font-bold">\n            🔍\n          </div>', '<div class="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center font-bold">\n            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>\n          </div>');

  // Strip emojis from JS options
  c = c.replaceAll("icon: '📚'", "icon: ''")
       .replaceAll("icon: '🎓'", "icon: ''")
       .replaceAll("icon: '💻'", "icon: ''")
       .replaceAll("icon: '📖'", "icon: ''")
       .replaceAll("icon: '📑'", "icon: ''")
       .replaceAll("icon: '🏢'", "icon: ''");

  fs.writeFileSync(searchPath, c, 'utf8');
  console.log('Cleaned SearchView.vue');
}

// 2. SubmitProjectView.vue
const submitPath = path.join(srcDir, 'views/SubmitProjectView.vue');
if (fs.existsSync(submitPath)) {
  let c = fs.readFileSync(submitPath, 'utf8');
  c = c.replace("{{ redundancyResult.risk_level === 'HIGH' ? '⚠️' : redundancyResult.risk_level === 'MODERATE' ? '💡' : '✅' }}", "");
  c = c.replace('<span>📜</span>\n              <span>ดูใบรับรองความซ้ำซ้อน (Certificate)</span>', '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>\n              <span>ดูใบรับรองความซ้ำซ้อน (Certificate)</span>');
  c = c.replace('<span>⚡ คำแนะนำสร้างความแปลกใหม่จาก Gemini AI:</span>', '<span class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> คำแนะนำสร้างความแปลกใหม่จาก Gemini AI:</span>');
  c = c.replace('<div class="font-bold line-clamp-1 text-[11px]">📄 {{ m.title_th }}</div>', '<div class="font-bold line-clamp-1 text-[11px] flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> {{ m.title_th }}</div>');
  c = c.replace('<span>📷 รูปภาพผู้วิจัย / ภาพหน้าปกงานวิจัย (Author Photo & Cover Art)</span>', '<span>รูปภาพผู้วิจัย / ภาพหน้าปกงานวิจัย (Author Photo & Cover Art)</span>');
  c = c.replace('<div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✨ รูปภาพพร้อมใช้งานสำหรับหน้าปกและโปรไฟล์ผู้วิจัย</div>', '<div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">รูปภาพพร้อมใช้งานสำหรับหน้าปกและโปรไฟล์ผู้วิจัย</div>');
  
  // Clean emoji icons in JS array
  c = c.replaceAll("icon: '🎓'", "icon: ''")
       .replaceAll("icon: '💻'", "icon: ''")
       .replaceAll("icon: '📖'", "icon: ''")
       .replaceAll("icon: '📑'", "icon: ''")
       .replaceAll("icon: '🏢'", "icon: ''");
  
  fs.writeFileSync(submitPath, c, 'utf8');
  console.log('Cleaned SubmitProjectView.vue');
}

// 3. TopicGeneratorView.vue
const topicPath = path.join(srcDir, 'views/TopicGeneratorView.vue');
if (fs.existsSync(topicPath)) {
  let c = fs.readFileSync(topicPath, 'utf8');
  c = c.replace('<span>⚡ GEMINI LLM • Thai NLP</span>', '<span>GEMINI LLM • Thai NLP</span>');
  c = c.replace('<span v-else>✨</span>', '<svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>');
  c = c.replace('<span class="text-xl">💡</span>', '<span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>');
  c = c.replace('⚡ Gemini LLM', 'Gemini LLM');
  c = c.replace('<span>🎯</span>', '<svg class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>');
  c = c.replace('⚙️ โมเดล / เทคโนโลยี:', 'โมเดล / เทคโนโลยี:');
  c = c.replace('👥 แหล่งข้อมูล & กลุ่มตัวอย่าง:', 'แหล่งข้อมูล & กลุ่มตัวอย่าง:');
  c = c.replace('👨‍🏫 อาจารย์ที่ปรึกษาแนะนำ:', 'อาจารย์ที่ปรึกษาแนะนำ:');
  c = c.replace("copiedId === p.id ? '✓ คัดลอกโครงร่างแล้ว!' : '📋 คัดลอกโครงร่างวิจัย'", "copiedId === p.id ? 'คัดลอกโครงร่างแล้ว!' : 'คัดลอกโครงร่างวิจัย'");

  // Clean prompt chips
  c = c.replace("icon: '🌾'", "icon: ''")
       .replace("icon: '🧵'", "icon: ''")
       .replace("icon: '🤖'", "icon: ''")
       .replace("icon: '🏥'", "icon: ''");

  fs.writeFileSync(topicPath, c, 'utf8');
  console.log('Cleaned TopicGeneratorView.vue');
}

// 4. TeacherReviewView.vue
const teacherPath = path.join(srcDir, 'views/TeacherReviewView.vue');
if (fs.existsSync(teacherPath)) {
  let c = fs.readFileSync(teacherPath, 'utf8');
  c = c.replaceAll('<span>📝</span>', '');
  c = c.replaceAll('<span>🗑️</span>', '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>');
  c = c.replaceAll('<span>⚠️</span>', '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>');
  c = c.replaceAll('<span>📄</span>', '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>');
  c = c.replaceAll('<span>👍</span>', '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>');
  c = c.replace("{{ note.type === 'REVISE' ? '⚠️ ต้องแก้ไข' : note.type === 'FORMAT' ? '📄 รูปแบบ/อ้างอิง' : '👍 จุดเด่น' }}", "{{ note.type === 'REVISE' ? 'ต้องแก้ไข' : note.type === 'FORMAT' ? 'รูปแบบ/อ้างอิง' : 'จุดเด่น' }}");
  fs.writeFileSync(teacherPath, c, 'utf8');
  console.log('Cleaned TeacherReviewView.vue');
}

// 5. AdminDashboardView.vue
const adminPath = path.join(srcDir, 'views/AdminDashboardView.vue');
if (fs.existsSync(adminPath)) {
  let c = fs.readFileSync(adminPath, 'utf8');
  c = c.replace('📚\n            </div>', '<svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>\n            </div>');
  c = c.replace('📥\n            </div>', '<svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>\n            </div>');
  c = c.replace('👁️\n            </div>', '<svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>\n            </div>');
  c = c.replace('<span class="text-xl">📈</span>', '<svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>');
  c = c.replaceAll('👁️ ดู', 'ดูรายละเอียด');
  c = c.replaceAll('🗑️ ลบ', 'ลบ');
  c = c.replace('<span>🔐 สลับเป็นสิทธิ์ ADMIN ทันที (1-Click)</span>', '<span>สลับเป็นสิทธิ์ ADMIN ทันที (1-Click)</span>');
  c = c.replaceAll('icon: \'🌾\'', 'icon: \'\'')
       .replaceAll('icon: \'🧵\'', 'icon: \'\'')
       .replaceAll('icon: \'💻\'', 'icon: \'\'')
       .replaceAll('icon: \'🌿\'', 'icon: \'\'')
       .replaceAll('icon: \'🏥\'', 'icon: \'\'');
  
  // Clean alert strings
  c = c.replaceAll('✅ ', '').replaceAll('⚠️ ', '').replaceAll('❌ ', '');
  fs.writeFileSync(adminPath, c, 'utf8');
  console.log('Cleaned AdminDashboardView.vue');
}

// 6. KnowledgeGraphView.vue
const graphPath = path.join(srcDir, 'views/KnowledgeGraphView.vue');
if (fs.existsSync(graphPath)) {
  let c = fs.readFileSync(graphPath, 'utf8');
  c = c.replace('<span>🕸️ Academic Knowledge Network</span>', '<span>Academic Knowledge Network</span>');
  c = c.replace('<option value="faculty">🏛️ เฉพาะคณะ (Faculty Hubs)</option>', '<option value="faculty">เฉพาะคณะ (Faculty Hubs)</option>');
  c = c.replace('<option value="concept">🧠 เฉพาะกลุ่มเทคโนโลยี (Concepts)</option>', '<option value="concept">เฉพาะกลุ่มเทคโนโลยี (Concepts)</option>');
  c = c.replace('<option value="advisor">👨‍🏫 เฉพาะอาจารย์ที่ปรึกษา (Advisors)</option>', '<option value="advisor">เฉพาะอาจารย์ที่ปรึกษา (Advisors)</option>');
  c = c.replace('<option value="project">📄 เฉพาะผลงานวิจัย (Projects)</option>', '<option value="project">เฉพาะผลงานวิจัย (Projects)</option>');
  c = c.replace('<span>🔄 รีเฟรช</span>', '<span>รีเฟรช</span>');
  c = c.replace("{{ node.type === 'faculty' ? '🏛️' : node.type === 'concept' ? '💡' : node.type === 'advisor' ? '👨‍🏫' : '📄' }}", "<span class='w-2 h-2 rounded-full inline-block mr-1' :class=\"node.type === 'faculty' ? 'bg-purple-500' : node.type === 'concept' ? 'bg-emerald-500' : node.type === 'advisor' ? 'bg-indigo-500' : 'bg-slate-400'\"></span>");
  c = c.replace('<div class="text-3xl">🎯</div>', '<svg class="w-10 h-10 text-purple-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>');
  c = c.replace('<span>✨</span>', '');
  fs.writeFileSync(graphPath, c, 'utf8');
  console.log('Cleaned KnowledgeGraphView.vue');
}

// 7. ProjectDetailView.vue
const detailPath = path.join(srcDir, 'views/ProjectDetailView.vue');
if (fs.existsSync(detailPath)) {
  let c = fs.readFileSync(detailPath, 'utf8');
  c = c.replaceAll("icon: '🌾'", "icon: ''")
       .replaceAll("icon: '🧵'", "icon: ''")
       .replaceAll("icon: '🐘'", "icon: ''")
       .replaceAll("icon: '💡'", "icon: ''");

  c = c.replaceAll("THESIS: '🎓'", "THESIS: ''")
       .replaceAll("SENIOR_PROJECT: '💻'", "SENIOR_PROJECT: ''")
       .replaceAll("INDEPENDENT_STUDY: '📖'", "INDEPENDENT_STUDY: ''")
       .replaceAll("RESEARCH_ARTICLE: '📑'", "RESEARCH_ARTICLE: ''")
       .replaceAll("RESEARCH_REPORT: '🏢'", "RESEARCH_REPORT: ''");

  // Clean chat fallback answers emojis
  c = c.replaceAll('📊', '').replaceAll('💡', '').replaceAll('🌾✨', '').replaceAll('📌', '').replaceAll('😊', '').replaceAll('📄', '');

  fs.writeFileSync(detailPath, c, 'utf8');
  console.log('Cleaned ProjectDetailView.vue');
}

console.log('All files processed successfully!');
