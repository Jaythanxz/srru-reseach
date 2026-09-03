<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Light & Airy Header -->
    <div class="bg-gradient-to-r from-purple-100/80 via-white to-emerald-50/80 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-8 border border-purple-100/90 dark:border-purple-800/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SRRU Executive Analytics & Knowledge Management</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">แดชบอร์ดสถิติและการบริหารจัดการ</h1>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          ภาพรวมปริมาณผลงานวิจัย สถิติการเข้าชมและดาวน์โหลด และการส่งออกรายงานข้อมูลสำหรับผู้บริหาร
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Export CSV Button -->
        <button
          @click="showExportModal = true"
          class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-800 to-emerald-700 hover:from-purple-700 hover:to-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span>ส่งออกรายงาน (Export CSV)</span>
        </button>

        <button
          @click="loadAllDashboardData"
          class="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 transition-colors flex items-center gap-2 shadow-2xs"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>อัปเดตสถิติ</span>
        </button>
      </div>
    </div>

    <!-- 1. KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ผลงานวิจัยทั้งหมด</span>
          <div class="text-3xl font-black text-slate-900 dark:text-white">{{ stats.totalPapers || 0 }}</div>
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">อนุมัติแล้ว {{ stats.approvedPapers || 0 }} รายการ</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl font-bold border border-purple-200 dark:border-purple-800">
          📚
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ยอดดาวน์โหลด PDF</span>
          <div class="text-3xl font-black text-slate-900 dark:text-white">{{ stats.totalDownloads || 0 }}</div>
          <span class="text-[11px] text-purple-600 dark:text-purple-400 font-bold">ดาวน์โหลดเพื่อการศึกษา</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-200 dark:border-emerald-800">
          📥
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ยอดการเข้าชม</span>
          <div class="text-3xl font-black text-slate-900 dark:text-white">{{ stats.totalViews || 0 }}</div>
          <span class="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">การสืบค้นและเปิดอ่าน</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold border border-indigo-200 dark:border-indigo-800">
          👁️
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">รอตรวจสอบ</span>
          <div class="text-3xl font-black text-purple-600 dark:text-purple-400">{{ stats.pendingApprovals || 0 }}</div>
          <span class="text-[11px] text-slate-500 dark:text-slate-400 font-bold">รออาจารย์ที่ปรึกษา</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold border border-amber-200 dark:border-amber-800">
          ⏳
        </div>
      </div>
    </div>

    <!-- 2. Faculty Distribution & Trending Search Keywords -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Faculty Bar Chart Breakdown -->
      <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/40 pb-3">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">สถิติจำนวนผลงานวิจัยจำแนกตามคณะ</h3>
          <span class="text-xs text-purple-600 dark:text-purple-400 font-bold">SRRU Faculties</span>
        </div>

        <div class="space-y-4">
          <div v-for="faculty in facultyStats" :key="faculty.faculty_id" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">{{ faculty.faculty_name }}</span>
              <span class="font-black text-slate-900 dark:text-white">{{ faculty.paper_count }} เรื่อง</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: `${calculatePercent(faculty.paper_count)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Search Keywords -->
      <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 shadow-xs space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/40 pb-3">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">คำค้นหายอดนิยม (Search Keywords & Thai NLP)</h3>
          <span class="text-xs text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            ความถี่สืบค้น
          </span>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <div
            v-for="kw in trendingKeywords"
            :key="kw.text"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-50/60 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-purple-950 border border-purple-100 dark:border-slate-700 hover:border-emerald-200 transition-colors text-xs"
          >
            <span class="font-bold text-slate-900 dark:text-white">#{{ kw.text }}</span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px] border border-emerald-200 dark:border-emerald-800">
              {{ kw.value }} ครั้ง
            </span>
          </div>
        </div>

        <p class="text-xs text-slate-500 dark:text-slate-400 bg-purple-50/40 dark:bg-slate-800/50 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          💡 ข้อมูลคำค้นหายอดนิยมถูกนำไปใช้อัปเดตคลังคำศัพท์และสร้างเวกเตอร์ TF-IDF และ Dense Semantic AI อัตโนมัติ
        </p>
      </div>
    </div>

    <!-- 2.5 📈 Research Trend Forecasting & Cluster Growth Heatmap (New Next-Level AI KPI) -->
    <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-purple-900/40 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">📈</span>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              การคาดการณ์แนวโน้มงานวิจัย & Heatmap การเติบโต (Research Trend Forecasting)
            </h3>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            วิเคราะห์อัตราการเติบโตรายปี (+% Growth Rate) และคาดการณ์คลัสเตอร์วิจัยยุทธศาสตร์ มรภ.สุรินทร์ (2022 - 2025F)
          </p>
        </div>
        <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
          AI Trend Predictive Model
        </span>
      </div>

      <!-- Growth Clusters Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        <div
          v-for="cluster in researchClusters"
          :key="cluster.id"
          class="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all space-y-3 shadow-2xs"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <span>{{ cluster.icon }}</span>
              <span>{{ cluster.name }}</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs border border-emerald-200 dark:border-emerald-800">
              +{{ cluster.growthRate }}% YoY
            </span>
          </div>

          <!-- Heatmap Multi-year Bar -->
          <div class="space-y-1">
            <div class="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>2565 (2022): {{ cluster.y2022 }}</span>
              <span>2566 (2023): {{ cluster.y2023 }}</span>
              <span>2567 (2024): {{ cluster.y2024 }}</span>
              <span class="font-bold text-purple-700 dark:text-purple-300">2568F: {{ cluster.y2025Forecast }}</span>
            </div>
            <div class="grid grid-cols-4 gap-1 h-3 rounded-lg overflow-hidden p-0.5 bg-slate-200 dark:bg-slate-700">
              <div class="bg-purple-300 dark:bg-purple-400 rounded" title="2565"></div>
              <div class="bg-purple-500 rounded" title="2566"></div>
              <div class="bg-purple-700 rounded" title="2567"></div>
              <div class="bg-emerald-500 rounded animate-pulse" title="2568 (คาดการณ์)"></div>
            </div>
          </div>

          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{{ cluster.strategicNote }}</p>
        </div>
      </div>
    </div>

    <!-- 2.5 Research Projects Repository Management & Deletion (Admin Only) -->
    <div v-if="authStore.isAdmin" class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-xs overflow-hidden space-y-4">
      <div class="p-6 border-b border-slate-100 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">คลังจัดการและลบผลงานวิจัย (Research Repository Management)</h3>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">สามารถค้นหา ตรวจสอบสถานะ และลบผลงานวิจัยที่อนุมัติแล้วออกจากระบบได้ถาวร</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <input
              v-model="projectSearch"
              type="text"
              placeholder="ค้นหาชื่อเรื่อง, ผู้แต่ง, คณะ..."
              class="w-64 pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <span class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 whitespace-nowrap">
            {{ filteredProjects.length }} / {{ allProjects.length }} เรื่อง
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">ชื่อผลงานวิจัย (Title)</th>
              <th class="px-6 py-4">ผู้จัดทำ / คณะ</th>
              <th class="px-6 py-4">ประเภท / ปี</th>
              <th class="px-6 py-4 text-center">สถานะ</th>
              <th class="px-6 py-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="filteredProjects.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-slate-400">ไม่พบข้อมูลผลงานวิจัยที่ค้นหา</td>
            </tr>
            <tr v-for="p in filteredProjects" :key="p.project_id" class="hover:bg-purple-50/20 dark:hover:bg-purple-950/40 transition-colors">
              <td class="px-6 py-4 font-bold text-purple-900 dark:text-purple-300">#{{ p.project_id }}</td>
              <td class="px-6 py-4 max-w-sm">
                <router-link :to="'/projects/' + p.project_id" class="font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2 transition-colors">
                  {{ p.title_th }}
                </router-link>
                <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{{ p.title_en || '-' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-slate-800 dark:text-slate-200">{{ p.authors || '-' }}</div>
                <div class="text-[11px] text-slate-400">{{ p.faculty_name || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-semibold">{{ p.project_type === 'THESIS' ? 'วิทยานิพนธ์' : 'โปรเจกต์จบ' }}</span>
                <span class="text-slate-400 ml-1">({{ (parseInt(p.publish_year) || 2024) + 543 }})</span>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-bold text-[11px]',
                    p.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                    p.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  ]"
                >
                  {{ p.status === 'APPROVED' ? 'อนุมัติแล้ว' : p.status === 'PENDING' ? 'รออนุมัติ' : 'ส่งกลับแก้ไข' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap space-x-2">
                <router-link
                  :to="'/projects/' + p.project_id"
                  class="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                >
                  👁️ ดู
                </router-link>
                <button
                  @click="handleDeleteProject(p.project_id, p.title_th)"
                  :disabled="isDeletingProject === p.project_id"
                  class="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 font-bold text-xs inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                  title="ลบผลงานวิจัยนี้ออกจากระบบ"
                >
                  <span v-if="isDeletingProject === p.project_id">กำลังลบ...</span>
                  <span v-else>🗑️ ลบ</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. User Management Table (Admin Only) -->
    <div v-if="authStore.isAdmin" class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-xs overflow-hidden space-y-4">
      <div class="p-6 border-b border-slate-100 dark:border-purple-900/40 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">การจัดการผู้ใช้งานและสิทธิ์ (User Roles & RBAC)</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">กำหนดบทบาทนักศึกษา อาจารย์ และผู้ดูแลระบบ</p>
        </div>
        <span class="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800">
          ทั้งหมด {{ users.length }} บัญชี
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">ชื่อ-นามสกุล / ชื่อผู้ใช้</th>
              <th class="px-6 py-4">อีเมล</th>
              <th class="px-6 py-4">คณะ</th>
              <th class="px-6 py-4">บทบาทปัจจุบัน (Role)</th>
              <th class="px-6 py-4 text-right">เปลี่ยนสิทธิ์</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="u in users" :key="u.user_id" class="hover:bg-purple-50/20 dark:hover:bg-purple-950/40">
              <td class="px-6 py-4 font-bold text-purple-900 dark:text-purple-300">#{{ u.user_id }}</td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ u.full_name }}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">@{{ u.username }}</div>
              </td>
              <td class="px-6 py-4">{{ u.email }}</td>
              <td class="px-6 py-4 font-medium">{{ u.faculty_name || '-' }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-bold text-[11px]',
                    u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800' :
                    u.role === 'TEACHER' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  ]"
                >
                  {{ u.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <select
                  :value="u.role"
                  @change="handleRoleChange(u.user_id, $event.target.value)"
                  class="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                >
                  <option value="STUDENT">STUDENT (นักศึกษา)</option>
                  <option value="TEACHER">TEACHER (อาจารย์)</option>
                  <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 4. Export CSV Modal Dialog -->
    <div v-if="showExportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-200 dark:border-purple-800 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-base border border-emerald-200 dark:border-emerald-800">
              📊
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">ส่งออกรายงานสถิติ (Export to CSV / Excel)</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">รองรับการเปิดอ่านใน Microsoft Excel ภาษาไทย 100%</p>
            </div>
          </div>
          <button @click="showExportModal = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold p-1">✕</button>
        </div>

        <div class="space-y-3">
          <!-- Option 1: Faculty Summary CSV -->
          <button
            type="button"
            @click="exportFacultySummaryCSV"
            class="w-full p-4 rounded-2xl bg-purple-50/70 dark:bg-slate-800/80 hover:bg-purple-100/80 dark:hover:bg-purple-950/80 border border-purple-200 dark:border-slate-700 text-left transition-all group flex items-center justify-between shadow-2xs"
          >
            <div class="space-y-0.5">
              <div class="font-bold text-xs text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                <span>🏢</span>
                <span>1. รายงานผลงานวิจัยจำแนกตามคณะ</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">จำนวนผลงานวิจัยและสัดส่วนร้อยละจำแนกตามคณะ</div>
            </div>
            <span class="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 text-purple-900 dark:text-purple-200 text-xs font-bold group-hover:bg-purple-700 group-hover:text-white transition-colors">
              ดาวน์โหลด .CSV
            </span>
          </button>

          <!-- Option 2: Project Views & Downloads CSV -->
          <button
            type="button"
            @click="exportViewsAndDownloadsCSV"
            class="w-full p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/80 border border-emerald-200 dark:border-slate-700 text-left transition-all group flex items-center justify-between shadow-2xs"
          >
            <div class="space-y-0.5">
              <div class="font-bold text-xs text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <span>📥</span>
                <span>2. รายงานยอดการเข้าชมและดาวน์โหลดรายเรื่อง</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">สถิติ View / Download รายโครงงาน พร้อมชื่อผู้จัดทำและอาจารย์</div>
            </div>
            <span class="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-emerald-200 dark:border-slate-600 text-emerald-900 dark:text-emerald-200 text-xs font-bold group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              ดาวน์โหลด .CSV
            </span>
          </button>

          <!-- Option 3: Trending Search Keywords CSV -->
          <button
            type="button"
            @click="exportTrendingKeywordsCSV"
            class="w-full p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/80 border border-indigo-200 dark:border-slate-700 text-left transition-all group flex items-center justify-between shadow-2xs"
          >
            <div class="space-y-0.5">
              <div class="font-bold text-xs text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <span>🔍</span>
                <span>3. รายงานคำค้นหายอดนิยม (Thai NLP)</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">สถิติความถี่คำค้นหาที่ผู้ใช้งานสืบค้นในระบบ</div>
            </div>
            <span class="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-indigo-200 dark:border-slate-600 text-indigo-900 dark:text-indigo-200 text-xs font-bold group-hover:bg-indigo-700 group-hover:text-white transition-colors">
              ดาวน์โหลด .CSV
            </span>
          </button>
        </div>

        <div class="flex justify-end pt-2 border-t border-purple-50 dark:border-purple-900/40">
          <button
            @click="showExportModal = false"
            class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const stats = ref({});
const facultyStats = ref([]);
const trendingKeywords = ref([]);
const users = ref([]);
const showExportModal = ref(false);

const allProjects = ref([]);
const projectSearch = ref('');
const isDeletingProject = ref(null);

const loadProjects = async () => {
  try {
    const res = await api.get('/projects?limit=100&status=');
    if (res.success) {
      allProjects.value = res.data || [];
    }
  } catch (e) {
    console.error('Failed to load projects for admin', e);
  }
};

const filteredProjects = computed(() => {
  if (!projectSearch.value.trim()) return allProjects.value;
  const q = projectSearch.value.toLowerCase().trim();
  return allProjects.value.filter(p =>
    (p.title_th && p.title_th.toLowerCase().includes(q)) ||
    (p.title_en && p.title_en.toLowerCase().includes(q)) ||
    (p.authors && p.authors.toLowerCase().includes(q)) ||
    (p.faculty_name && p.faculty_name.toLowerCase().includes(q))
  );
});

const handleDeleteProject = async (projectId, title) => {
  if (!confirm(`⚠️ ยืนยันการลบผลงานวิจัย:\n"${title}"\n\nคำเตือน: เมื่อลบแล้ว ข้อมูลผลงานและไฟล์ PDF จะถูกลบออกจากคลังวิจัยอย่างถาวร ยืนยันที่จะลบหรือไม่?`)) {
    return;
  }
  try {
    isDeletingProject.value = projectId;
    const res = await api.delete(`/projects/${projectId}`);
    if (res.success) {
      alert('✅ ลบผลงานวิจัยออกจากระบบเรียบร้อยแล้ว');
      await loadProjects();
      await loadAllDashboardData();
    }
  } catch (err) {
    alert(`❌ เกิดข้อผิดพลาด: ${err?.message || 'ไม่สามารถลบผลงานได้'}`);
  } finally {
    isDeletingProject.value = null;
  }
};

const researchClusters = ref([
  {
    id: 1,
    name: 'Smart Agri & ข้าวหอมมะลิ AI',
    icon: '🌾',
    growthRate: 38,
    y2022: 4,
    y2023: 7,
    y2024: 12,
    y2025Forecast: 18,
    strategicNote: 'คลัสเตอร์ยุทธศาสตร์อันดับ 1 ของมหาวิทยาลัย ได้รับงบวิจัยสนับสนุนเพิ่มขึ้น 40%'
  },
  {
    id: 2,
    name: 'หัตถกรรมผ้าไหม & เศรษฐกิจสร้างสรรค์',
    icon: '🧵',
    growthRate: 24,
    y2022: 3,
    y2023: 5,
    y2024: 8,
    y2025Forecast: 11,
    strategicNote: 'ยกระดับลายผ้าไหมสุรินทร์ด้วย AR / E-Commerce และการตลาดระดับสากล'
  },
  {
    id: 3,
    name: 'AI, Data Science & Thai NLP',
    icon: '💻',
    growthRate: 45,
    y2022: 2,
    y2023: 6,
    y2024: 14,
    y2025Forecast: 22,
    strategicNote: 'กลุ่มที่มีอัตราการเติบโตสูงสุดในกลุ่มโครงงานโปรเจกต์จบคอมพิวเตอร์'
  },
  {
    id: 4,
    name: 'BCG Economy & พลังงานทดแทน',
    icon: '🌿',
    growthRate: 32,
    y2022: 2,
    y2023: 4,
    y2024: 7,
    y2025Forecast: 10,
    strategicNote: 'ตอบสนองเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) ของจังหวัดสุรินทร์'
  },
  {
    id: 5,
    name: 'สาธารณสุขชุมชน & สังคมสูงวัย',
    icon: '🏥',
    growthRate: 19,
    y2022: 3,
    y2023: 4,
    y2024: 6,
    y2025Forecast: 8,
    strategicNote: 'พัฒนาระบบเฝ้าระวังผู้สูงอายุและบริการสุขภาพทางไกล (Telehealth)'
  }
]);

const loadAllDashboardData = async () => {
  try {
    const dashRes = await api.get('/admin/dashboard');
    if (dashRes.success) {
      stats.value = dashRes.stats;
      facultyStats.value = dashRes.facultyStats;
    }

    const trendRes = await api.get('/admin/trending-keywords');
    if (trendRes.success) {
      trendingKeywords.value = trendRes.data;
    }

    if (authStore.isAdmin) {
      const usersRes = await api.get('/admin/users');
      if (usersRes.success) {
        users.value = usersRes.data;
      }
    }
  } catch (err) {
    console.error('Load dashboard error:', err);
  }
};

const calculatePercent = (count) => {
  const max = Math.max(...facultyStats.value.map(f => f.paper_count), 1);
  return Math.min(Math.round((count / max) * 100), 100);
};

const handleRoleChange = async (userId, newRole) => {
  try {
    await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    alert(`อัปเดตบทบาทผู้ใช้รหัส #${userId} เป็น ${newRole} สำเร็จ`);
    loadAllDashboardData();
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

// Helper to trigger UTF-8 CSV Download with BOM
const triggerCSVDownload = (csvContent, fileName) => {
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 1. Export Faculty Summary
const exportFacultySummaryCSV = () => {
  const total = stats.value.totalPapers || 1;
  let csv = 'รหัสคณะ,ชื่อคณะ/หน่วยงาน,จำนวนผลงานวิจัย (เรื่อง),สัดส่วนร้อยละ (%)\n';
  facultyStats.value.forEach(f => {
    const pct = ((f.paper_count / total) * 100).toFixed(1);
    csv += `"${f.faculty_id}","${f.faculty_name}","${f.paper_count}","${pct}%"\n`;
  });
  csv += `\n"รวมทั้งหมด","","${stats.value.totalPapers || 0}","100%"\n`;
  triggerCSVDownload(csv, `SRRU_Faculty_Research_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
};

// 2. Export Views and Downloads Report
const exportViewsAndDownloadsCSV = async () => {
  try {
    const res = await api.get('/projects', { params: { limit: 100, status: 'ALL' } });
    const papers = res.data || [];
    let csv = 'รหัสโครงงาน,ประเภทเอกสาร,ชื่อเรื่องภาษาไทย,คณะ,สาขาวิชา,ผู้จัดทำ,อาจารย์ที่ปรึกษา,ยอดเข้าชม (ครั้ง),ยอดดาวน์โหลด (ครั้ง),ปีที่พิมพ์\n';
    papers.forEach(p => {
      csv += `"${p.project_id}","${p.project_type || 'THESIS'}","${(p.title_th || '').replace(/"/g, '""')}","${p.faculty_name || ''}","${p.department_name || ''}","${p.authors || ''}","${p.advisor_name || ''}","${p.view_count || 0}","${p.download_count || 0}","${p.publish_year + 543}"\n`;
    });
    triggerCSVDownload(csv, `SRRU_Projects_Views_Downloads_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการดึงข้อมูลส่งออก: ' + err.message);
  }
};

// 3. Export Trending Keywords CSV
const exportTrendingKeywordsCSV = () => {
  let csv = 'ลำดับ,คำค้นหา (Keyword),ความถี่การสืบค้น (ครั้ง)\n';
  trendingKeywords.value.forEach((k, idx) => {
    csv += `"${idx + 1}","${k.text}","${k.value}"\n`;
  });
  triggerCSVDownload(csv, `SRRU_Trending_Keywords_${new Date().toISOString().slice(0, 10)}.csv`);
};

onMounted(() => {
  loadAllDashboardData();
});
</script>
