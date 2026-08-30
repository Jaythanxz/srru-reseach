<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-lg w-full bg-white dark:bg-slate-900/95 rounded-3xl border border-purple-100 dark:border-purple-900/50 p-8 sm:p-10 shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">ลงทะเบียนนักศึกษา</h1>
        <p class="text-xs text-purple-600 dark:text-purple-300">สร้างบัญชีผู้ใช้งานเพื่อส่งและติดตามผลงานวิจัย</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ชื่อ-นามสกุล <span class="text-rose-500">*</span></label>
          <input
            v-model="form.full_name"
            required
            type="text"
            placeholder="เช่น นายกิตติศักดิ์ พูลสวัสดิ์"
            class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-800 dark:text-slate-200">อีเมลมหาวิทยาลัย (@student.srru.ac.th) <span class="text-rose-500">*</span></label>
          <input
            v-model="form.email"
            required
            type="email"
            placeholder="เช่น kittisak.p@student.srru.ac.th"
            class="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">ชื่อผู้ใช้ (Username) <span class="text-rose-500">*</span></label>
            <input
              v-model="form.username"
              required
              type="text"
              placeholder="เช่น kittisak.p"
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-800 dark:text-slate-200">รหัสผ่าน <span class="text-rose-500">*</span></label>
            <input
              v-model="form.password"
              required
              type="password"
              placeholder="••••••••"
              class="w-full text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-800 to-emerald-600 hover:from-purple-700 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
        >
          <span v-if="authStore.loading">กำลังลงทะเบียน...</span>
          <span v-else>ยืนยันการลงทะเบียน</span>
        </button>
      </form>

      <div class="text-center text-xs text-slate-500 dark:text-slate-400">
        มีบัญชีผู้ใช้งานแล้ว?
        <router-link to="/login" class="font-bold text-purple-700 dark:text-purple-300 hover:underline">เข้าสู่ระบบ</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  full_name: '',
  email: '',
  username: '',
  password: '',
  faculty_id: 1,
  department_id: 1
});

const handleRegister = async () => {
  try {
    await authStore.register(form);
    alert('ลงทะเบียนสำเร็จ ยินดีต้อนรับเข้าสู่ระบบคลังงานวิจัย SRRU');
    router.push('/');
  } catch (err) {
    alert(`ลงทะเบียนไม่สำเร็จ: ${err.message || 'ข้อมูลไม่ถูกต้อง'}`);
  }
};
</script>
