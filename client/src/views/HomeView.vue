<template>
  <div class="space-y-12 sm:space-y-16 pb-20">
    <!-- Hero Search Section (Ultra-Clean & Prominent) -->
    <section class="relative overflow-hidden bg-gradient-to-b from-purple-100/80 via-white to-emerald-50/60 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-4 border border-purple-100/90 dark:border-purple-800/40 shadow-xs transition-colors duration-300">
      <!-- Subtle Ambient Glow -->
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-purple-200/50 dark:bg-purple-900/30 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-200/40 dark:bg-emerald-900/30 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-6 sm:space-y-8">
        <!-- Heading with Royal SRRU Gradient -->
        <div class="space-y-3">
          <h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-normal text-slate-900 dark:text-white leading-relaxed sm:leading-normal">
            คลังงานวิจัยและโปรเจกต์จบ<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-800 to-emerald-600 dark:from-purple-400 dark:via-purple-300 dark:to-emerald-400">
              มหาวิทยาลัยราชภัฏสุรินทร์
            </span>
          </h1>
          <p class="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            สืบค้นวิทยานิพนธ์ รายงานการวิจัย และโครงงานนักศึกษา
          </p>
        </div>

        <!-- Prominent Centered Search Bar -->
        <div class="max-w-2xl mx-auto">
          <div class="relative" ref="homeSearchContainerRef">
            <form
              @submit.prevent="handleSearch"
              class="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-2 sm:p-2.5 border border-slate-200 dark:border-slate-700 focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all gap-2"
            >
              <div class="pl-2.5 text-slate-400 dark:text-slate-500 flex items-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchKeyword"
                @focus="showHomeSuggestions = true"
                type="text"
                placeholder="ค้นหาชื่อผลงาน, คำสำคัญ, คณะ หรือชื่ออาจารย์ที่ปรึกษา..."
                class="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none px-2 py-1.5"
              />
              <button
                type="submit"
                class="px-6 py-2.5 sm:py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all whitespace-nowrap"
              >
                สืบค้น
              </button>
            </form>

            <!-- Autocomplete Suggestions Dropdown -->
            <div
              v-if="showHomeSuggestions && (matchingHomeProjects.length > 0 || filteredHomeSuggestions.length > 0 || homeRecentSearches.length > 0)"
              class="absolute left-0 right-0 top-full mt-1.5 bg-[#1e232d] text-white rounded-2xl border border-slate-700/80 shadow-2xl z-50 overflow-hidden text-xs text-left max-h-80 overflow-y-auto divide-y divide-slate-800/80"
            >
              <!-- 1. Matching Projects -->
              <div v-if="matchingHomeProjects.length > 0" class="p-2 space-y-1 bg-purple-950/20">
                <div class="text-[10px] font-bold text-emerald-400 px-2.5 py-1 flex items-center justify-between">
                  <span>ผลงานวิจัยที่ตรงกับคำค้นหา (คลิกเพื่อเปิดอ่าน):</span>
                  <span class="text-[10px] text-slate-400 font-normal">พบ {{ matchingHomeProjects.length }} เรื่อง</span>
                </div>
                <router-link
                  v-for="paper in matchingHomeProjects"
                  :key="paper.project_id"
                  :to="`/projects/${paper.project_id}`"
                  @click="showHomeSuggestions = false"
                  class="block p-2.5 rounded-xl hover:bg-slate-800/90 text-left transition-all border border-transparent hover:border-purple-500/40 group"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="space-y-0.5 flex-1">
                      <div class="font-bold text-white group-hover:text-purple-300 text-xs line-clamp-1">
                        {{ paper.title_th }}
                      </div>
                      <div class="text-[10px] text-slate-400 line-clamp-1 flex items-center gap-2">
                        <span>{{ paper.authors }}</span>
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

              <!-- 2. Suggestions -->
              <div v-if="filteredHomeSuggestions.length > 0" class="p-2 space-y-0.5">
                <div class="text-[10px] font-bold text-slate-400 px-2.5 py-1">คำแนะนำการค้นหา:</div>
                <button
                  v-for="(item, idx) in filteredHomeSuggestions"
                  :key="idx"
                  @click="applyHomeSearch(item)"
                  class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs flex items-center justify-between transition-colors group"
                >
                  <span class="font-medium group-hover:text-purple-300">{{ item }}</span>
                  <span class="text-[10px] text-slate-500 group-hover:text-slate-300">สืบค้น ↵</span>
                </button>
              </div>

              <!-- 3. Recent Searches -->
              <div v-if="homeRecentSearches.length > 0" class="p-2 space-y-1">
                <div class="text-[10px] font-bold text-slate-400 px-2.5 py-1">ประวัติการค้นหาล่าสุด:</div>
                <div class="flex flex-wrap gap-1.5 px-2 py-1">
                  <button
                    v-for="(recent, rIdx) in homeRecentSearches"
                    :key="rIdx"
                    @click="applyHomeSearch(recent)"
                    class="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors border border-slate-700"
                  >
                    {{ recent }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Clean Elegant Trending Chips with Proper Spacing -->
          <div class="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
            <span class="font-medium text-slate-400 dark:text-slate-500">คำค้นหายอดนิยม:</span>
            <button
              v-for="tag in trendingTags"
              :key="tag"
              @click="searchByTag(tag)"
              class="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-purple-200/70 dark:border-purple-800/60 text-purple-800 dark:text-purple-300 hover:bg-purple-100/80 dark:hover:bg-purple-900/50 hover:border-purple-300 transition-all shadow-2xs text-[11px] font-medium hover:scale-105"
            >
              #{{ tag }}
            </button>
          </div>
        </div>

        <!-- Clean Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-300">7+</div>
            <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">คณะและสำนัก</div>
          </div>
          <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">100%</div>
            <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">เอกสารฉบับเต็ม (PDF)</div>
          </div>
          <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-300">Semantic</div>
            <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">สืบค้นเชิงความหมาย</div>
          </div>
          <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">Open Access</div>
            <div class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">เข้าถึงงานวิจัยได้ทันที</div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      <!-- 🖼️ Visual Showcase: 4 Regional & AI Pillars of Surin Rajabhat -->
      <section class="space-y-6">
        <div class="border-b border-purple-100 dark:border-purple-800/40 pb-4">
          <div class="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>SRRU Research Focus & Visual Showcase</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>นวัตกรรมและงานวิจัยเด่นเพื่อการพัฒนาท้องถิ่นสุรินทร์</span>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              มรภ.สุรินทร์
            </span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
            บูรณาการเทคโนโลยีดิจิทัล ปัญญาประดิษฐ์ (AI) และภูมิปัญญาท้องถิ่นสู่การพัฒนาเศรษฐกิจ BCG อย่างยั่งยืน
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 1. Jasmine Rice AI -->
          <router-link to="/projects/2" class="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col justify-end h-72">
            <img src="/images/project_rice.jpg" alt="ข้าวหอมมะลิสุรินทร์" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="relative p-5 space-y-2 text-white">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500 text-emerald-950 text-[10px] font-black uppercase">เกษตรอัจฉริยะ</span>
              <h3 class="text-sm font-bold leading-snug group-hover:text-emerald-300 transition-colors">
                AI วินิจฉัยโรคใบข้าวหอมมะลิสุรินทร์
              </h3>
              <p class="text-[11px] text-slate-300 line-clamp-2">
                โมบายแอปพลิเคชันจำแนกโรคใบข้าวด้วย Deep Learning CNN เพื่อเกษตรกรสุรินทร์
              </p>
            </div>
          </router-link>

          <!-- 2. Surin Silk Live Commerce -->
          <router-link to="/projects/3" class="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-amber-200/80 dark:border-amber-900/60 flex flex-col justify-end h-72">
            <img src="/images/project_silk.jpg" alt="ผ้าไหมสุรินทร์" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="relative p-5 space-y-2 text-white">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase">เศรษฐกิจสร้างสรรค์</span>
              <h3 class="text-sm font-bold leading-snug group-hover:text-amber-300 transition-colors">
                ระบบ Live Commerce ผ้าไหมท่าสว่าง
              </h3>
              <p class="text-[11px] text-slate-300 line-clamp-2">
                แพลตฟอร์มพาณิชย์อิเล็กทรอนิกส์และไลฟ์สดเพื่อวิสาหกิจชุมชนผ้าไหมสุรินทร์
              </p>
            </div>
          </router-link>

          <!-- 3. Surin Tourism GIS & Elephant Center -->
          <router-link to="/projects/4" class="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-purple-200/80 dark:border-purple-900/60 flex flex-col justify-end h-72">
            <img src="/images/project_gis.jpg" alt="ท่องเที่ยวสุรินทร์ GIS" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="relative p-5 space-y-2 text-white">
              <span class="px-2.5 py-0.5 rounded-full bg-purple-400 text-purple-950 text-[10px] font-black uppercase">GIS ท่องเที่ยว</span>
              <h3 class="text-sm font-bold leading-snug group-hover:text-purple-300 transition-colors">
                GIS แหล่งท่องเที่ยวปราสาทหิน & หมู่บ้านช้าง
              </h3>
              <p class="text-[11px] text-slate-300 line-clamp-2">
                ระบบสารสนเทศภูมิศาสตร์ 3 มิติเพื่อส่งเสริมเส้นทางท่องเที่ยวเชิงประวัติศาสตร์สุรินทร์
              </p>
            </div>
          </router-link>

          <!-- 4. Thai NLP & AI Research Hub -->
          <router-link to="/projects/1" class="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-blue-200/80 dark:border-blue-900/60 flex flex-col justify-end h-72">
            <img src="/images/project_nlp.jpg" alt="Thai NLP AI Research" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="relative p-5 space-y-2 text-white">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-400 text-blue-950 text-[10px] font-black uppercase">ปัญญาประดิษฐ์ AI</span>
              <h3 class="text-sm font-bold leading-snug group-hover:text-blue-300 transition-colors">
                ระบบสืบค้นเชิงความหมายและแนะนำงานวิจัย
              </h3>
              <p class="text-[11px] text-slate-300 line-clamp-2">
                โมเดล Dense Semantic Search และ Hybrid Recommendation ด้วย Thai NLP
              </p>
            </div>
          </router-link>
        </div>
      </section>

            <!-- Section 1: Research Recommendation Grid -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-100 dark:border-purple-800/40 pb-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              งานวิจัยแนะนำสำหรับคุณ
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
              คัดสรรผลงานวิจัยที่น่าสนใจและตรงกับความสนใจของคุณ
            </p>
          </div>

          <router-link
            to="/search"
            class="text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 group"
          >
            <span>ดูงานวิจัยทั้งหมด</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </router-link>
        </div>

        <!-- Recommendations Grid -->
        <div v-if="recStore.loadingPersonalized" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="h-64 rounded-3xl bg-purple-50/80 dark:bg-purple-950/40 animate-pulse"></div>
        </div>

        <div v-else-if="recStore.personalizedProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            v-for="project in recStore.personalizedProjects"
            :key="project.project_id"
            :project="project"
          />
        </div>

        <div v-else class="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-800/60 text-slate-500 dark:text-slate-400 text-sm">
          กำลังประมวลผลคำแนะนำงานวิจัยที่เหมาะสมกับคุณ...
        </div>
      </section>

      <!-- Section 2: Trending & Popular Research -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-800/40 pb-4">
          <div>
            <span class="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Top Viewed & Downloaded</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">งานวิจัยยอดนิยมและมีการสืบค้นสูงสุด</h2>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="selectedSort = 'popular'"
              :class="['px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all', selectedSort === 'popular' ? 'bg-purple-800 dark:bg-purple-700 text-white shadow-xs' : 'bg-purple-50 dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-800 border border-transparent dark:border-purple-800/60']"
            >
              ยอดเข้าชมสูงสุด
            </button>
            <button
              @click="selectedSort = 'newest'"
              :class="['px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all', selectedSort === 'newest' ? 'bg-purple-800 dark:bg-purple-700 text-white shadow-xs' : 'bg-purple-50 dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-800 border border-transparent dark:border-purple-800/60']"
            >
              ล่าสุด
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            v-for="project in displayedProjects"
            :key="project.project_id"
            :project="project"
          />
        </div>
      </section>

      <!-- Section 3: AI KM Highlights Showcase (Clean & Airy) -->
      <section class="bg-gradient-to-r from-purple-50 via-white to-emerald-50 dark:from-[#1f103d] dark:via-[#140b29] dark:to-[#081f18] rounded-3xl p-6 sm:p-10 border border-purple-100/90 dark:border-purple-800/40 shadow-xs transition-colors duration-300">
        <div class="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span class="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest">SRRU Smart KM Highlights</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">ระบบสืบค้นและจัดการงานวิจัยอัจฉริยะ</h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light">
            ยกระดับคลังความรู้ มรภ.สุรินทร์ สู่ศูนย์กลางนวัตกรรมดิจิทัลด้วยปัญญาประดิษฐ์ภาษาไทย
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-purple-100/80 dark:border-purple-800/60 shadow-2xs space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center justify-center font-bold text-xl">
              🧠
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Semantic Vector Search</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              วิเคราะห์ความหมายแฝงและกลุ่มคำพ้องความหมาย (Synonyms) เช่น Machine Learning กับ AI ได้อย่างแม่นยำ
            </p>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-purple-100/80 dark:border-purple-800/60 shadow-2xs space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xl">
              💬
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">AI Chat with PDF (RAG)</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              เปิดโอกาสให้นักศึกษาพิมพ์ถาม-ตอบเนื้อหาในเล่มวิทยานิพนธ์ได้ทันที พร้อมระบุเลขหน้าอ้างอิง
            </p>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-purple-100/80 dark:border-purple-800/60 shadow-2xs space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Hybrid Recommendation</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              ผสานความคล้ายของเนื้อหาเข้ากับพฤติกรรมผู้ใช้ เพื่อแนะนำงานวิจัยเชิงรุก (Active KM Discovery)
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../stores/project';
import { useRecommendationStore } from '../stores/recommendation';
import { useBookmarkStore } from '../stores/bookmark';
import { useAuthStore } from '../stores/auth';
import ProjectCard from '../components/ProjectCard.vue';

const router = useRouter();
const projectStore = useProjectStore();
const recStore = useRecommendationStore();
const bookmarkStore = useBookmarkStore();
const authStore = useAuthStore();

const searchKeyword = ref('');
const searchMode = ref('semantic');
const selectedSort = ref('popular');
const trendingTags = ['ปัญญาประดิษฐ์', 'ข้าวหอมมะลิสุรินทร์', 'การตลาดดิจิทัล', 'ผ้าไหม', 'IoT', 'ระบบแนะนำ'];

const showHomeSuggestions = ref(false);
const homeSearchContainerRef = ref(null);

const homeKeywordBank = [
  'ข้าวหอมมะลิสุรินทร์',
  'การจำแนกโรคใบข้าว CNN',
  'ผ้าไหมท่าสว่าง สุรินทร์',
  'Live Commerce พาณิชย์อิเล็กทรอนิกส์',
  'ระบบสารสนเทศภูมิศาสตร์ GIS',
  'แหล่งท่องเที่ยวปราสาทหินและหมู่บ้านช้าง',
  'การสืบค้นเชิงความหมาย Thai NLP',
  'ปัญญาประดิษฐ์ AI มรภ.สุรินทร์',
  'BCG Economy เกษตรอินทรีย์',
  'โมบายแอปพลิเคชันเพื่อการเกษตร'
];

const homeRecentSearches = ref(
  JSON.parse(localStorage.getItem('srru_recent_searches') || '["ข้าวหอมมะลิ", "ผ้าไหมสุรินทร์", "AI Semantic Search"]')
);

const matchingHomeProjects = computed(() => {
  const kw = (searchKeyword.value || '').toLowerCase().trim();
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

const filteredHomeSuggestions = computed(() => {
  const kw = (searchKeyword.value || '').toLowerCase().trim();
  if (!kw) return homeKeywordBank.slice(0, 5);
  return homeKeywordBank.filter(k => k.toLowerCase().includes(kw)).slice(0, 5);
});

const applyHomeSearch = (kw) => {
  searchKeyword.value = kw;
  showHomeSuggestions.value = false;
  handleSearch();
};

const handleHomeClickOutside = (e) => {
  if (homeSearchContainerRef.value && !homeSearchContainerRef.value.contains(e.target)) {
    showHomeSuggestions.value = false;
  }
};

const handleSearch = () => {
  if (searchKeyword.value && searchKeyword.value.trim()) {
    const list = [searchKeyword.value.trim(), ...homeRecentSearches.value.filter(i => i !== searchKeyword.value.trim())].slice(0, 8);
    localStorage.setItem('srru_recent_searches', JSON.stringify(list));
  }
  router.push({
    path: '/search',
    query: { keyword: searchKeyword.value, mode: searchMode.value }
  });
};

const searchByTag = (tag) => {
  router.push({
    path: '/search',
    query: { keyword: tag, mode: 'semantic' }
  });
};

const displayedProjects = computed(() => {
  const list = [...projectStore.projects];
  if (selectedSort.value === 'popular') {
    return list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 6);
  }
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
});

onMounted(async () => {
  window.addEventListener('click', handleHomeClickOutside);
  await projectStore.fetchProjects({ status: 'APPROVED' });
  await recStore.fetchPersonalized(6);
  if (authStore.isAuthenticated) {
    await bookmarkStore.fetchBookmarks();
  }
});

watch(() => authStore.user?.user_id, () => {
  recStore.fetchPersonalized(6);
  if (authStore.isAuthenticated) {
    bookmarkStore.fetchBookmarks();
  }
});
</script>
