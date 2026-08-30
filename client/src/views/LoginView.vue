<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white dark:bg-slate-900/95 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-8 sm:p-10 shadow-2xl space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-emerald-500 flex items-center justify-center mx-auto text-white font-black text-lg shadow-lg">
          SRRU
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">เข้าสู่ระบบ</h1>
        <p class="text-xs text-purple-600 dark:text-purple-300">คลังงานวิจัยดิจิทัล มหาวิทยาลัยราชภัฏสุรินทร์</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ชื่อผู้ใช้งาน (Username)</label>
          <input
            v-model="username"
            required
            type="text"
            placeholder="เช่น student1, teacher1, admin"
            class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">รหัสผ่าน (Password)</label>
          <input
            v-model="password"
            required
            type="password"
            placeholder="••••••••"
            class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-800 to-emerald-600 hover:from-purple-700 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
        >
          <span v-if="authStore.loading">กำลังเข้าสู่ระบบ...</span>
          <span v-else>เข้าสู่ระบบ</span>
        </button>
      </form>

      <!-- Quick Demo Accounts Box -->
      <div class="bg-purple-50/70 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 space-y-2 text-xs">
        <div class="font-bold text-purple-900 dark:text-purple-200">💡 บัญชีทดสอบระบบ (Demo Accounts):</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="fillDemo('student1')"
            class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 hover:border-emerald-500 text-left shadow-sm"
          >
            <div class="font-bold text-slate-800 dark:text-slate-200">นักศึกษา</div>
            <div class="text-[10px] text-purple-600 dark:text-purple-300">student1</div>
          </button>
          <button
            @click="fillDemo('teacher1')"
            class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 hover:border-purple-600 text-left shadow-sm"
          >
            <div class="font-bold text-slate-800 dark:text-slate-200">อาจารย์</div>
            <div class="text-[10px] text-purple-600 dark:text-purple-300">teacher1</div>
          </button>
          <button
            @click="fillDemo('admin')"
            class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 hover:border-indigo-500 text-left shadow-sm"
          >
            <div class="font-bold text-slate-800 dark:text-slate-200">แอดมิน</div>
            <div class="text-[10px] text-purple-600 dark:text-purple-300">admin</div>
          </button>
        </div>
      </div>

      <div class="text-center text-xs text-slate-500 dark:text-slate-400">
        ยังไม่มีบัญชีผู้ใช้?
        <router-link to="/register" class="font-bold text-purple-700 dark:text-purple-300 hover:underline">ลงทะเบียนนักศึกษา</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const username = ref('student1');
const password = ref('password123');

const fillDemo = (user) => {
  username.value = user;
  password.value = 'password123';
};

const handleLogin = async () => {
  try {
    const res = await authStore.login(username.value, password.value);
    const redirectPath = route.query.redirect || (res.user.role === 'TEACHER' ? '/teacher/review' : res.user.role === 'ADMIN' ? '/admin' : '/');
    router.push(redirectPath);
  } catch (err) {
    alert(`เข้าสู่ระบบไม่สำเร็จ: ${err.message || 'ข้อมูลไม่ถูกต้อง'}`);
  }
};
</script>
