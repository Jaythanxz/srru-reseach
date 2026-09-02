import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SearchView from '../views/SearchView.vue';
import ProjectDetailView from '../views/ProjectDetailView.vue';
import SubmitProjectView from '../views/SubmitProjectView.vue';
import TeacherReviewView from '../views/TeacherReviewView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';
import BookmarksView from '../views/BookmarksView.vue';
import MySubmissionsView from '../views/MySubmissionsView.vue';
import TopicGeneratorView from '../views/TopicGeneratorView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'หน้าแรก' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: 'สืบค้นงานวิจัยขั้นสูง' }
  },
  {
    path: '/topic-generator',
    name: 'topic-generator',
    component: TopicGeneratorView,
    meta: { title: 'AI ช่วยคิดหัวข้อวิจัยและโปรเจกต์จบ' }
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: ProjectDetailView,
    meta: { title: 'รายละเอียดงานวิจัยและเอกสารฉบับเต็ม' }
  },
  {
    path: '/submit',
    name: 'submit-project',
    component: SubmitProjectView,
    meta: { requiresAuth: true, roles: ['STUDENT', 'ADMIN'], title: 'ส่งผลงานวิจัย/โปรเจกต์จบ' }
  },
  {
    path: '/teacher/review',
    alias: '/teacher-review',
    name: 'teacher-review',
    component: TeacherReviewView,
    meta: { requiresAuth: true, roles: ['TEACHER', 'ADMIN'], title: 'ระบบตรวจสอบและอนุมัติผลงาน' }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, roles: ['ADMIN', 'TEACHER'], title: 'แดชบอร์ดสถิติและการจัดการ' }
  },
  {
    path: '/my-submissions',
    name: 'my-submissions',
    component: MySubmissionsView,
    meta: { requiresAuth: true, title: 'ผลงานวิจัยของฉัน' }
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: BookmarksView,
    meta: { requiresAuth: true, title: 'รายการงานวิจัยที่บันทึกไว้' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'เข้าสู่ระบบ' }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: 'ลงทะเบียนนักศึกษา' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation Guard for Authentication and RBAC
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('srru_auth_token');
  const user = JSON.parse(localStorage.getItem('srru_user') || 'null');

  if (to.meta.title) {
    document.title = `${to.meta.title} | คลังงานวิจัย มหาวิทยาลัยราชภัฏสุรินทร์`;
  }

  if (to.meta.requiresAuth) {
    if (!token || !user) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      alert(`คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (สำหรับ ${to.meta.roles.join(', ')})`);
      return next({ name: 'home' });
    }
  }

  next();
});

export default router;
