<template>
  <footer class="bg-purple-950 border-t border-purple-900 text-purple-300 text-sm py-12 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Col 1: Brand Info -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-emerald-500 flex items-center justify-center font-black text-white text-lg shadow-md">
              SRRU
            </div>
            <div>
              <h3 class="text-white font-bold text-base">มหาวิทยาลัยราชภัฏสุรินทร์</h3>
              <p class="text-xs text-purple-300">Surindra Rajabhat University Digital Research Repository</p>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-purple-200/80 max-w-md">
            ระบบคลังโครงงานวิจัยบัณฑิตศึกษาและโปรเจกต์จบเชิงรุก ขับเคลื่อนด้วยปัญญาประดิษฐ์และระบบแนะนำแบบผสมผสาน (Hybrid Recommendation Engine) และ Semantic Dense Vector Search เพื่อส่งเสริมการต่อยอดองค์ความรู้และนวัตกรรมท้องถิ่น
          </p>
        </div>

        <!-- Col 2: Quick Links -->
        <div>
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">เมนูด่วน</h4>
          <ul class="space-y-2 text-xs">
            <li><router-link to="/" class="hover:text-emerald-400 transition-colors">หน้าหลัก</router-link></li>
            <li><router-link to="/search" class="hover:text-emerald-400 transition-colors">ค้นหางานวิจัยทั้งหมด</router-link></li>
            <li><router-link to="/submit" class="hover:text-emerald-400 transition-colors">ส่งผลงานนักศึกษา</router-link></li>
            <li><router-link to="/teacher/review" class="hover:text-emerald-400 transition-colors">ระบบอาจารย์ที่ปรึกษา</router-link></li>
          </ul>
        </div>

        <!-- Col 3: Faculties & Contact -->
        <div>
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">หน่วยงานและคณะ</h4>
          <ul class="space-y-2 text-xs">
            <li>คณะวิทยาศาสตร์และเทคโนโลยี</li>
            <li>คณะมนุษยศาสตร์และสังคมศาสตร์</li>
            <li>คณะวิทยาการจัดการ</li>
            <li>คณะครุศาสตร์ / คณะเทคโนโลยีอุตสาหกรรม</li>
            <li>บัณฑิตวิทยาลัย มหาวิทยาลัยราชภัฏสุรินทร์</li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-purple-900 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400 gap-4">
        <p>© 2024 มหาวิทยาลัยราชภัฏสุรินทร์ (SRRU). สงวนลิขสิทธิ์ทุกประการ.</p>
        <div class="flex items-center gap-4">
          <span class="text-emerald-400 font-semibold">Thai NLP & Dense Vector Semantic Search</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Version 1.2.0</span>
        </div>
      </div>
    </div>
  </footer>
</template>
