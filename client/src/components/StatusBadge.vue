<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border',
      statusClasses
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', dotClasses]"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'PENDING'
  }
});

const statusLabel = computed(() => {
  switch (props.status) {
    case 'APPROVED':
      return 'อนุมัติแล้ว (Approved)';
    case 'REJECTED':
      return 'ส่งกลับแก้ไข (Rejected)';
    case 'PENDING':
    default:
      return 'รอตรวจสอบ (Pending)';
  }
});

const statusClasses = computed(() => {
  switch (props.status) {
    case 'APPROVED':
      return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'REJECTED':
      return 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'PENDING':
    default:
      return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
});

const dotClasses = computed(() => {
  switch (props.status) {
    case 'APPROVED':
      return 'bg-emerald-500';
    case 'REJECTED':
      return 'bg-rose-500';
    case 'PENDING':
    default:
      return 'bg-amber-500 animate-pulse';
  }
});
</script>
