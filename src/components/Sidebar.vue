<template>
  <aside class="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between p-6 shrink-0">
    <div>
      <div class="flex items-center gap-3 mb-8">
        <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">TH</div>
        <h1 class="text-lg font-extrabold text-white tracking-wide">TerapicHelper</h1>
      </div>

      <nav class="space-y-2">
        <router-link to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/dashboard' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>🏠</span> Inicio
        </router-link>
        <router-link to="/customers" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/customers' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>👥</span> Pacientes
        </router-link>
        <router-link to="/specialists" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/specialists' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>👨‍⚕️</span> Especialistas
        </router-link>
        <router-link to="/sessions" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/sessions' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>📅</span> Sesiones
        </router-link>
        <router-link to="/equipments" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/equipments' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>🛠️</span> Equipos
        </router-link>
        <router-link to="/tags" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/tags' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>🏷️</span> Etiquetas
        </router-link>
        <router-link to="/histories" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/histories' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>📋</span> Historiales
        </router-link>
        <router-link to="/reviews" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="$route.path === '/reviews' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'">
          <span>⭐</span> Reseñas
        </router-link>
      </nav>
    </div>

    <div class="pt-4 border-t border-slate-700">
      <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl text-sm font-medium transition">
        <span>🚪</span> Cerrar Sesión
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const router = useRouter();
const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>