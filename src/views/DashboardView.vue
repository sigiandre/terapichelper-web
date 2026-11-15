<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-8">
      <!-- Encabezado superior -->
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Panel de Control</h2>
          <p class="text-sm text-slate-400 mt-1">Gestión centralizada de fisioterapia y teleconsultas.</p>
        </div>
        <div class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-emerald-400">.NET 10 Conectado</span>
        </div>
      </div>

            <!-- Banner de Bienvenida -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl text-white flex items-center justify-between">
        <div class="space-y-2">
          <h3 class="text-2xl font-bold flex items-center gap-2">
            ¡Bienvenido de nuevo, TerapicHelper! ⚡
          </h3>
          <p class="text-blue-100 text-sm max-w-2xl">
            Tu plataforma inteligente para el control clínico, equipos y planes terapéuticos está lista para operar con PostgreSQL.
          </p>
        </div>
      </div>

      <!-- ESTADÍSTICAS RÁPIDAS (KPIs) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 uppercase font-semibold tracking-wider">Equipos Registrados</p>
            <h3 class="text-3xl font-bold text-white mt-1">{{ stats.equipmentsCount }}</h3>
          </div>
          <div class="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 text-xl">🛠️</div>
        </div>

        <div class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 uppercase font-semibold tracking-wider">Estado del Sistema</p>
            <h3 class="text-xl font-bold text-emerald-400 mt-1">Óptimo / Activo</h3>
          </div>
          <div class="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xl">🟢</div>
        </div>

        <div class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 uppercase font-semibold tracking-wider">Módulos Operativos</p>
            <h3 class="text-3xl font-bold text-white mt-1">6</h3>
          </div>
          <div class="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-400 text-xl">⚡</div>
        </div>
      </div>

      <!-- Accesos Rápidos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Equipos -->
        <router-link to="/equipments" class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg hover:border-blue-500 transition group flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-blue-400 uppercase tracking-widest">Inventario</span>
            <h4 class="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition">Equipos</h4>
            <p class="text-xs text-slate-400 mt-2">Administra el inventario, estado y mantenimiento de los dispositivos de terapia.</p>
          </div>
          <span class="text-xs font-semibold text-blue-400 mt-6 inline-flex items-center gap-1">Gestionar equipos →</span>
        </router-link>

        <!-- Sesiones -->
        <router-link to="/sessions" class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg hover:border-blue-500 transition group flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Agenda</span>
            <h4 class="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition">Sesiones</h4>
            <p class="text-xs text-slate-400 mt-2">Programa citas, controla horarios de atención y enlaces de videollamada.</p>
          </div>
          <span class="text-xs font-semibold text-emerald-400 mt-6 inline-flex items-center gap-1">Ver sesiones →</span>
        </router-link>

        <!-- Etiquetado -->
        <router-link to="/tags" class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg hover:border-blue-500 transition group flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-purple-400 uppercase tracking-widest">Organización</span>
            <h4 class="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition">Etiquetas</h4>
            <p class="text-xs text-slate-400 mt-2">Clasifica los elementos clínicos y recursos con etiquetas del sistema.</p>
          </div>
          <span class="text-xs font-semibold text-purple-400 mt-6 inline-flex items-center gap-1">Ver etiquetas →</span>
        </router-link>

        <!-- Historiales -->
        <router-link to="/histories" class="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg hover:border-blue-500 transition group flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">Clínico</span>
            <h4 class="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition">Historiales</h4>
            <p class="text-xs text-slate-400 mt-2">Revisa el registro clínico, notas de evolución y seguimiento de sesiones.</p>
          </div>
          <span class="text-xs font-semibold text-amber-400 mt-6 inline-flex items-center gap-1">Ver historiales →</span>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import api from '../services/api';

const stats = ref({
  equipmentsCount: 0
});

const loadStats = async () => {
  try {
    const res = await api.get('/Equipments');
    stats.value.equipmentsCount = res.data.length;
  } catch (err) {
    console.error('Error al cargar estadísticas del dashboard:', err);
  }
};

onMounted(() => {
  loadStats();
});
</script>