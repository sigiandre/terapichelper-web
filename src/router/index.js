import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import SessionsView from '../views/SessionsView.vue';
import EquipmentsView from '../views/EquipmentsView.vue';
import TagsView from '../views/TagsView.vue';
import HistoriesView from '../views/HistoriesView.vue';
import CustomersView from '../views/CustomersView.vue'; // <--- Importante
import LoginView from '../views/LoginView.vue';
import SpecialistsView from '../views/SpecialistsView.vue';
import ReviewsView from '../views/ReviewsView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/customers', component: CustomersView, meta: { requiresAuth: true } },
  { path: '/specialists', component: SpecialistsView, meta: { requiresAuth: true } },
  { path: '/sessions', component: SessionsView, meta: { requiresAuth: true } },
  { path: '/equipments', component: EquipmentsView, meta: { requiresAuth: true } },
  { path: '/tags', component: TagsView, meta: { requiresAuth: true } },
  { path: '/histories', component: HistoriesView, meta: { requiresAuth: true } },
  { path: '/reviews', component: ReviewsView, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;