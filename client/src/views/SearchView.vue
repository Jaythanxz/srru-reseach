<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Light & Dark Ready Header Banner -->
    <div class="bg-gradient-to-r from-purple-100/80 via-white to-emerald-50/80 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-6 sm:p-8 shadow-xs border border-purple-100/90 dark:border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
      <div class="max-w-2xl space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>สืบค้นงานวิจัยดิจิทัล มรภ.สุรินทร์</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          สืบค้นคลังโครงงานวิจัยและวิทยานิพนธ์
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed font-light">
          ค้นหาผลงานวิจัยตามประเภทเอกสาร สาขาวิชา หรือใช้ระบบวิเคราะห์ความหมาย AI (Dense Semantic Search)
        </p>
      </div>

      <!-- Quick Stats in Banner -->
      <div class="flex items-center gap-3 self-start md:self-auto">
        <div class="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-800/60 shadow-2xs text-center">
          <div class="text-lg font-black text-purple-700 dark:text-purple-300">{{ projectStore.projects.length }}</div>
          <div class="text-[10px] text-slate-400 font-medium">ผลงานที่ค้นพบ</div>
        </div>
      </div>
    </div>

    <!-- Quick Document Type Filter Pills Row -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <button
        v-for="dt in documentTypeOptions"
        :key="dt.value"
        @click="filters.project_type = dt.value; onFilterChange()"
        :class="[
          'px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs',
          filters.project_type === dt.value
            ? 'bg-purple-800 dark:bg-purple-700 text-white shadow-xs'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-purple-100/80 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950'
        ]"
      >
        <span>{{ dt.icon }}</span>
        <span>{{ dt.label }}</span>
      </button>
    </div>

    <!-- Search & Filter Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Filter Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100/90 dark:border-purple-900/50 p-6 shadow-xs space-y-5 sticky top-24">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/40 pb-3">
            <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              <span>ตัวกรองการสืบค้น</span>
            </h3>
            <button
              @click="clearAllFilters"
              class="text-xs text-purple-600 dark:text-purple-400 hover:text-rose-500 font-semibold transition-colors"
            >
              ล้างค่าทั้งหมด
            </button>
          </div>

          <!-- 1. Search Mode Selector -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>โหมดการค้นหา</span>
              <span class="text-[10px] text-purple-600 dark:text-purple-400 font-normal">
                {{ filters.mode === 'semantic' ? 'Thai Dense Vector' : 'Exact Keyword' }}
              </span>
            </label>
            <div class="grid grid-cols-2 gap-1 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-2xl text-[11px]">
              <button
                @click="filters.mode = 'semantic'; onFilterChange()"
                :class="[
                  'py-2 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1',
                  filters.mode === 'semantic'
                    ? 'bg-purple-800 dark:bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span>🧠</span>
                <span>Semantic AI</span>
              </button>
              <button
                @click="filters.mode = 'standard'; onFilterChange()"
                :class="[
                  'py-2 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1',
                  filters.mode === 'standard'
                    ? 'bg-purple-800 dark:bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span>🔍</span>
                <span>ตรงตัว (Exact)</span>
              </button>
            </div>
          </div>

          <!-- 2. Keyword Filter with Predictive Autocomplete & Direct Research Paper Match -->
          <div class="space-y-1.5 relative" ref="searchContainerRef">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">คำค้นหา / ประโยค</label>
            <div class="relative flex items-center bg-slate-900 text-white rounded-2xl border border-slate-700 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-400/30 overflow-hidden transition-all">
              <span class="pl-3 pr-1 text-slate-400 text-sm font-bold select-none">+</span>
              <input
                v-model="filters.keyword"
                @focus="showSuggestions = true"
                @input="handleKeywordInput"
                @keydown.enter="applyKeywordSearch(filters.keyword)"
                type="text"
                placeholder="พิมพ์คำค้นหา เช่น ข้าว, ผ้าไหม, GIS..."
                class="w-full text-xs py-2.5 bg-transparent border-0 focus:outline-none text-white placeholder:text-slate-400 px-2"
              />
              <button
                v-if="filters.keyword"
                @click="filters.keyword = ''; onFilterChange()"
                type="button"
                class="text-slate-400 hover:text-white text-xs font-bold px-1.5"
              >
                ✕
              </button>
              <!-- AI Mode Toggle Pill Button on Right (Matching Screenshot) -->
              <button
                type="button"
                @click="toggleSearchMode"
                :title="filters.mode === 'semantic' ? 'โหมด AI Semantic Search (คลิกเพื่อสลับเป็นตรงตัว)' : 'โหมดตรงตัว (คลิกเพื่อสลับเป็น AI)'"
                class="mr-1.5 my-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-purple-900/90 border border-slate-700 text-slate-200 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
              >
                <span>{{ filters.mode === 'semantic' ? 'โหมด AI ➔' : 'โหมด ตรงตัว 🔍' }}</span>
              </button>
            </div>

            <!-- 💡 Predictive Autocomplete & Direct Research Paper Dropdown (Matching Screenshot) -->
            <div
              v-if="showSuggestions && (matchingProjects.length > 0 || filteredSuggestions.length > 0 || recentSearches.length > 0)"
              class="absolute left-0 right-0 top-full mt-1 bg-[#1e232d] text-white rounded-2xl border border-slate-700/80 shadow-2xl z-50 overflow-hidden text-xs max-h-80 overflow-y-auto divide-y divide-slate-800/80"
            >
              <!-- 1. Direct Matching Research Papers ("เอางานวิจัยขึ้นมาให้เลย") -->
              <div v-if="matchingProjects.length > 0" class="p-2 space-y-1 bg-purple-950/20">
                <div class="text-[10px] font-bold text-emerald-400 px-2.5 py-1 flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    <span>📄</span>
                    <span>งานวิจัยที่ตรงกับคำค้นหาทันที (คลิกเพื่อเปิดอ่าน):</span>
                  </span>
                  <span class="text-[10px] text-slate-400 font-normal">พบ {{ matchingProjects.length }} เรื่อง</span>
                </div>
                <router-link
                  v-for="paper in matchingProjects"
                  :key="paper.project_id"
                  :to="`/projects/${paper.project_id}`"
                  @click="showSuggestions = false"
                  class="block p-2.5 rounded-xl hover:bg-slate-800/90 text-left transition-all border border-transparent hover:border-purple-500/40 group"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="space-y-0.5 flex-1">
                      <div class="font-bold text-white group-hover:text-purple-300 text-xs line-clamp-1 flex items-center gap-1.5">
                        <span class="text-sm">📑</span>
                        <span>{{ paper.title_th }}</span>
                      </div>
                      <div class="text-[10px] text-slate-400 line-clamp-1 flex items-center gap-2">
                        <span>👤 {{ paper.authors }}</span>
                        <span>•</span>
                        <span>{{ paper.faculty_name || 'มรภ.สุรินทร์' }}</span>
                        <span>•</span>
                        <span class="text-emerald-400 font-bold">พ.ศ. {{ (paper.publish_year ? parseInt(paper.publish_year) : 2024) + 543 }}</span>
                      </div>
                    </div>
                    <span class="text-[10px] text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0 font-bold bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800">
                      เปิดอ่าน ➔
                    </span>
                  </div>
                </router-link>
              </div>

              <!-- 2. Predictive Search Keywords (เหมือนในรูปเป๊ะ เช่น 🔍 พดด้วง / 🔍 พด.1) -->
              <div v-if="filteredSuggestions.length > 0" class="p-2 space-y-0.5">
                <div class="text-[10px] font-bold text-slate-400 px-2.5 py-1 flex items-center gap-1">
                  <span>🔍</span>
                  <span>คำแนะนำการค้นหา:</span>
                </div>
                <button
                  v-for="(item, idx) in filteredSuggestions"
                  :key="idx"
                  @click="applyKeywordSearch(item)"
                  class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs flex items-center justify-between transition-colors group"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-slate-400 text-xs">🔍</span>
                    <span class="font-medium group-hover:text-purple-300">{{ item }}</span>
                  </span>
                  <span class="text-[10px] text-slate-500 group-hover:text-slate-300">ค้นหา ↵</span>
                </button>
              </div>

              <!-- 3. Recent Searches -->
              <div v-if="recentSearches.length > 0" class="p-2 space-y-1">
                <div class="text-[10px] font-bold text-slate-400 px-2.5 py-1 flex items-center justify-between">
                  <span class="flex items-center gap-1">
                    <span>🕒</span>
                    <span>ประวัติการค้นหาล่าสุด:</span>
                  </span>
                  <button @click="clearRecentSearches" class="text-[10px] text-rose-400 hover:underline">
                    ล้างประวัติ
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5 px-2 py-1">
                  <button
                    v-for="(recent, rIdx) in recentSearches"
                    :key="rIdx"
                    @click="applyKeywordSearch(recent)"
                    class="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors flex items-center gap-1 border border-slate-700"
                  >
                    <span>{{ recent }}</span>
                    <span @click.stop="removeRecentSearch(rIdx)" class="text-slate-400 hover:text-rose-400 font-bold ml-0.5">✕</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Document Type Filter Dropdown -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">ประเภทของเอกสาร</label>
            <select
              v-model="filters.project_type"
              @change="onFilterChange"
              class="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
            >
              <option value="">ทุกประเภทเอกสาร</option>
              <option value="THESIS">🎓 วิทยานิพนธ์ (ระดับบัณฑิตศึกษา)</option>
              <option value="SENIOR_PROJECT">💻 โปรเจกต์จบ (ปริญญาตรี)</option>
              <option value="INDEPENDENT_STUDY">📖 การค้นคว้าอิสระ (IS)</option>
              <option value="RESEARCH_ARTICLE">📑 บทความวิจัย / ผลงานตีพิมพ์</option>
              <option value="RESEARCH_REPORT">🏢 รายงานการวิจัยสถาบัน</option>
            </select>
          </div>

          <!-- 4. Faculty Filter -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">คณะ / หน่วยงาน</label>
            <select
              v-model="filters.faculty_id"
              @change="onFacultyChange"
              class="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
            >
              <option value="">ทุกคณะ</option>
              <option v-for="f in projectStore.faculties" :key="f.faculty_id" :value="f.faculty_id">
                {{ f.faculty_name }}
              </option>
            </select>
          </div>

          <!-- 5. Department Filter -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">สาขาวิชา / ภาควิชา</label>
            <select
              v-model="filters.department_id"
              @change="onFilterChange"
              :disabled="availableDepartments.length === 0"
              class="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white disabled:opacity-50"
            >
              <option value="">ทุกสาขาวิชา</option>
              <option v-for="d in availableDepartments" :key="d.department_id" :value="d.department_id">
                {{ d.department_name }}
              </option>
            </select>
          </div>

          <!-- 6. Publication Year Filter -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">ปีที่เผยแพร่</label>
            <select
              v-model="filters.year"
              @change="onFilterChange"
              class="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
            >
              <option value="">ทุกปีการศึกษา</option>
              <option value="2024">พ.ศ. 2567 (2024)</option>
              <option value="2023">พ.ศ. 2566 (2023)</option>
              <option value="2022">พ.ศ. 2565 (2022)</option>
              <option value="2021">พ.ศ. 2564 (2021)</option>
              <option value="2020">พ.ศ. 2563 (2020)</option>
            </select>
          </div>

          <!-- 7. Sort Filter -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">เรียงตาม</label>
            <select
              v-model="filters.sort"
              @change="onFilterChange"
              class="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
            >
              <option value="newest">⚡ อัปเดตล่าสุด</option>
              <option value="relevance">⭐ ความตรงใจ AI (Relevance)</option>
              <option value="popular">🔥 ยอดเข้าชมสูงสุด</option>
              <option value="downloads">📥 ยอดดาวน์โหลดสูงสุด</option>
              <option value="year">📅 ปีพิมพ์ล่าสุด</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Right Results Content Area -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Results Summary Bar & Active Filters Badges -->
        <div class="bg-white dark:bg-slate-900/90 rounded-2xl border border-purple-100/80 dark:border-purple-900/50 p-4 shadow-xs space-y-3 text-xs">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2 flex-wrap">
              <span>ผลการสืบค้น:</span>
              <span class="px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 font-bold border border-purple-200 dark:border-purple-800">
                {{ projectStore.projects.length }} รายการ
              </span>
              <span v-if="filters.mode === 'semantic'" class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Dense Semantic AI</span>
              </span>
            </div>

            <!-- View Mode Switcher: Single Grid vs Grouped by Document Type -->
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold self-end sm:self-auto">
              <button
                @click="viewMode = 'grouped'"
                :class="['px-3 py-1.5 rounded-lg transition-all', viewMode === 'grouped' ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']"
              >
                📑 แยกตามประเภท
              </button>
              <button
                @click="viewMode = 'grid'"
                :class="['px-3 py-1.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']"
              >
                ▦ รวมทั้งหมด
              </button>
            </div>
          </div>

          <!-- Active Filter Badges -->
          <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span class="text-slate-500 dark:text-slate-400 font-medium">ตัวกรองที่เลือก:</span>

            <span v-if="filters.keyword" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
              <span>คำค้น: "{{ filters.keyword }}"</span>
              <button @click="filters.keyword = ''; onFilterChange()" class="hover:text-rose-500 font-bold ml-1">✕</button>
            </span>

            <span v-if="filters.project_type" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              <span>{{ getDocTypeLabel(filters.project_type) }}</span>
              <button @click="filters.project_type = ''; onFilterChange()" class="hover:text-rose-500 font-bold ml-1">✕</button>
            </span>

            <span v-if="selectedFacultyName" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
              <span>{{ selectedFacultyName }}</span>
              <button @click="filters.faculty_id = ''; onFacultyChange()" class="hover:text-rose-500 font-bold ml-1">✕</button>
            </span>

            <span v-if="selectedDepartmentName" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
              <span>{{ selectedDepartmentName }}</span>
              <button @click="filters.department_id = ''; onFilterChange()" class="hover:text-rose-500 font-bold ml-1">✕</button>
            </span>

            <span v-if="filters.year" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              <span>พ.ศ. {{ parseInt(filters.year) + 543 }}</span>
              <button @click="filters.year = ''; onFilterChange()" class="hover:text-rose-500 font-bold ml-1">✕</button>
            </span>

            <button
              @click="clearAllFilters"
              class="text-rose-600 dark:text-rose-400 hover:underline font-bold text-[11px] ml-1"
            >
              ล้างทั้งหมด
            </button>
          </div>
        </div>

        <!-- Projects Loading State -->
        <div v-if="projectStore.loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="h-64 rounded-3xl bg-purple-50/80 dark:bg-slate-800/80 animate-pulse"></div>
        </div>

        <!-- Mode 1: Grouped by Document Type Sections -->
        <div v-else-if="viewMode === 'grouped' && projectStore.projects.length > 0" class="space-y-10">
          <section
            v-for="group in groupedProjects"
            :key="group.type"
            class="space-y-4"
          >
            <!-- Section Header -->
            <div class="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/50 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ group.icon }}</span>
                <h2 class="text-base font-black text-slate-900 dark:text-white">{{ group.title }}</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 font-bold text-xs border border-purple-200 dark:border-purple-800">
                  {{ group.projects.length }} เรื่อง
                </span>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ group.desc }}</span>
            </div>

            <!-- Group Projects Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectCard
                v-for="project in group.projects"
                :key="project.project_id"
                :project="project"
              />
            </div>
          </section>
        </div>

        <!-- Mode 2: Standard Single Grid -->
        <div v-else-if="projectStore.projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCard
            v-for="project in projectStore.projects"
            :key="project.project_id"
            :project="project"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-8 space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center text-2xl font-bold">
            🔍
          </div>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">ไม่พบข้อมูลงานวิจัยที่ตรงกับเงื่อนไข</h3>
          <p class="text-xs text-slate-500 dark:text-slate-300 max-w-md mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือสลับไปใช้โหมด <strong>Semantic AI</strong> เพื่อค้นหาตามความหมายที่คล้ายคลึงกัน
          </p>
          <button
            @click="clearAllFilters"
            class="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-xs"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../stores/project';
import ProjectCard from '../components/ProjectCard.vue';

const route = useRoute();
const projectStore = useProjectStore();

const viewMode = ref('grouped'); // 'grouped' | 'grid'
const showSuggestions = ref(false);
const searchContainerRef = ref(null);

const documentTypeOptions = [
  { value: '', label: 'ทุกประเภทเอกสาร', icon: '📚' },
  { value: 'THESIS', label: 'วิทยานิพนธ์', icon: '🎓' },
  { value: 'SENIOR_PROJECT', label: 'โปรเจกต์จบ (ป.ตรี)', icon: '💻' },
  { value: 'INDEPENDENT_STUDY', label: 'การค้นคว้าอิสระ (IS)', icon: '📖' },
  { value: 'RESEARCH_ARTICLE', label: 'บทความวิจัย', icon: '📑' },
  { value: 'RESEARCH_REPORT', label: 'รายงานวิจัยสถาบัน', icon: '🏢' }
];

const filters = reactive({
  keyword: route.query.keyword || '',
  mode: route.query.mode || 'semantic',
  project_type: route.query.project_type || '',
  faculty_id: route.query.faculty_id || '',
  department_id: route.query.department_id || '',
  year: route.query.year || '',
  sort: 'newest'
});

// Bank of common domain search keywords in SRRU
const keywordBank = [
  'ข้าวหอมมะลิสุรินทร์',
  'การจำแนกโรคใบข้าว CNN',
  'ผ้าไหมท่าสว่าง สุรินทร์',
  'Live Commerce พาณิชย์อิเล็กทรอนิกส์',
  'ระบบสารสนเทศภูมิศาสตร์ GIS',
  'แหล่งท่องเที่ยวปราสาทหินและหมู่บ้านช้าง',
  'การสืบค้นเชิงความหมาย Thai NLP',
  'ปัญญาประดิษฐ์ AI มรภ.สุรินทร์',
  'BCG Economy เกษตรอินทรีย์',
  'โมบายแอปพลิเคชันเพื่อการเกษตร',
  'การเรียนรู้เชิงลึก Deep Learning',
  'บทเรียนคอมพิวเตอร์ช่วยสอน CAI',
  'ระบบบริหารจัดการวิทยานิพนธ์',
  'การตรวจจับความซ้ำซ้อนของงานวิจัย'
];

// Recent searches stored in LocalStorage
const recentSearches = ref(
  JSON.parse(localStorage.getItem('srru_recent_searches') || '["ข้าวหอมมะลิ", "ผ้าไหมสุรินทร์", "AI Semantic Search"]')
);

const saveRecentSearch = (kw) => {
  if (!kw || !kw.trim()) return;
  const clean = kw.trim();
  const list = [clean, ...recentSearches.value.filter(item => item !== clean)].slice(0, 8);
  recentSearches.value = list;
  localStorage.setItem('srru_recent_searches', JSON.stringify(list));
};

const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1);
  localStorage.setItem('srru_recent_searches', JSON.stringify(recentSearches.value));
};

const clearRecentSearches = () => {
  recentSearches.value = [];
  localStorage.removeItem('srru_recent_searches');
};

// Live Matching Research Projects from Database ("เอางานวิจัยขึ้นมาให้เลย")
const matchingProjects = computed(() => {
  const kw = (filters.keyword || '').toLowerCase().trim();
  if (!kw) return [];
  return projectStore.projects.filter(p => {
    const tTh = (p.title_th || '').toLowerCase();
    const tEn = (p.title_en || '').toLowerCase();
    const abs = (p.abstract_text || '').toLowerCase();
    const kws = (p.keywords || '').toLowerCase();
    const aut = (p.authors || '').toLowerCase();
    return tTh.includes(kw) || tEn.includes(kw) || abs.includes(kw) || kws.includes(kw) || aut.includes(kw);
  }).slice(0, 4);
});

const toggleSearchMode = () => {
  filters.mode = filters.mode === 'semantic' ? 'standard' : 'semantic';
  onFilterChange();
};

// Filtered Predictive Autocomplete Suggestions
const filteredSuggestions = computed(() => {
  const kw = (filters.keyword || '').toLowerCase().trim();
  if (!kw) {
    return keywordBank.slice(0, 6);
  }
  return keywordBank.filter(k => k.toLowerCase().includes(kw)).slice(0, 6);
});

const applyKeywordSearch = (kw) => {
  filters.keyword = kw;
  saveRecentSearch(kw);
  showSuggestions.value = false;
  onFilterChange();
};

const handleKeywordInput = () => {
  showSuggestions.value = true;
  onFilterChange();
};

// Click outside handler to close autocomplete dropdown
const handleClickOutside = (e) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target)) {
    showSuggestions.value = false;
  }
};

const selectedFacultyName = computed(() => {
  if (!filters.faculty_id) return '';
  const found = projectStore.faculties.find(f => f.faculty_id === parseInt(filters.faculty_id));
  return found ? found.faculty_name : '';
});

const selectedDepartmentName = computed(() => {
  if (!filters.department_id) return '';
  const allDepts = projectStore.faculties.flatMap(f => f.departments || []);
  const found = allDepts.find(d => d.department_id === parseInt(filters.department_id));
  return found ? found.department_name : '';
});

const hasActiveFilters = computed(() => {
  return !!(filters.keyword || filters.project_type || filters.faculty_id || filters.department_id || filters.year);
});

const getDocTypeLabel = (type) => {
  const found = documentTypeOptions.find(d => d.value === type);
  return found ? found.label : type;
};

// Group projects by category
const groupedProjects = computed(() => {
  const groupsDef = [
    { type: 'THESIS', title: 'วิทยานิพนธ์ (ระดับบัณฑิตศึกษา ป.โท/ป.เอก)', icon: '🎓', desc: 'Master & Doctoral Theses' },
    { type: 'SENIOR_PROJECT', title: 'โครงงานวิจัยโปรเจกต์จบ (ระดับปริญญาตรี)', icon: '💻', desc: 'Undergraduate Senior Projects' },
    { type: 'INDEPENDENT_STUDY', title: 'การศึกษาค้นคว้าอิสระ (IS)', icon: '📖', desc: 'Independent Studies' },
    { type: 'RESEARCH_ARTICLE', title: 'บทความวิจัยและผลงานตีพิมพ์ทางวิชาการ', icon: '📑', desc: 'Journal & Conference Articles' },
    { type: 'RESEARCH_REPORT', title: 'รายงานการวิจัยฉบับสมบูรณ์ / ทุนวิจัยสถาบัน', icon: '🏢', desc: 'Institutional Research Reports' }
  ];

  const result = [];
  groupsDef.forEach(def => {
    const list = projectStore.projects.filter(p => p.project_type === def.type);
    if (list.length > 0) {
      result.push({
        ...def,
        projects: list
      });
    }
  });
  return result;
});

const availableDepartments = computed(() => {
  if (!filters.faculty_id) {
    return projectStore.faculties.flatMap(f => f.departments || []);
  }
  const found = projectStore.faculties.find(f => f.faculty_id === parseInt(filters.faculty_id));
  return found?.departments || [];
});

const onFacultyChange = () => {
  filters.department_id = '';
  onFilterChange();
};

let debounceTimer = null;
const onFilterChange = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (filters.keyword) {
      saveRecentSearch(filters.keyword);
    }
    projectStore.fetchProjects({ ...filters, status: 'APPROVED' });
  }, 250);
};

const clearAllFilters = () => {
  filters.keyword = '';
  filters.mode = 'semantic';
  filters.project_type = '';
  filters.faculty_id = '';
  filters.department_id = '';
  filters.year = '';
  filters.sort = 'newest';
  projectStore.fetchProjects({ status: 'APPROVED' });
};

onMounted(async () => {
  window.addEventListener('click', handleClickOutside);
  await projectStore.fetchFaculties();
  await projectStore.fetchProjects({ ...filters, status: 'APPROVED' });
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
