<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Gestión de Especialistas</h2>
          <p class="text-sm text-slate-400 mt-1">Directorio del personal médico, fisioterapeutas y profesionales de la clínica.</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
          + Nuevo Especialista
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Cargando especialistas...</div>
        <div v-else-if="specialists.length === 0" class="p-8 text-center text-slate-400">No hay especialistas registrados en el sistema.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th class="p-4">ID</th>
                <th class="p-4">Nombre Completo</th>
                <th class="p-4">Especialidad / Área</th>
                <th class="p-4">Correo Electrónico</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/70 text-sm">
              <tr v-for="s in specialists" :key="s.specialistId || s.specialistsId" class="hover:bg-slate-700/30 transition">
                <td class="p-4 font-mono text-slate-400">#{{ s.specialistId || s.specialistsId }}</td>
                <td class="p-4 font-medium text-white">{{ s.name || s.fullName }}</td>
                <td class="p-4 text-slate-300">
                  <span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">{{ s.specialty || 'Fisioterapia General' }}</span>
                </td>
                <td class="p-4 text-slate-300">{{ s.email || 'No registrado' }}</td>
                <td class="p-4 text-right">
                  <button @click="deleteSpecialist(s.specialistId || s.specialistsId)" class="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Registrar Nuevo Especialista</h3>
        <form @submit.prevent="createSpecialist" class="space-y-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Nombre Completo</label>
            <input v-model="newSpecialist.name" type="text" required placeholder="Ej. Dr. Carlos Mendoza" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Especialidad</label>
            <input v-model="newSpecialist.specialty" type="text" required placeholder="Ej. Fisioterapia Deportiva" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Correo Electrónico</label>
            <input v-model="newSpecialist.email" type="email" placeholder="especialista@clinica.com" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Especialista</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import api from '../services/api';

const specialists = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newSpecialist = ref({
  name: '',
  specialty: '',
  email: ''
});

const loadSpecialists = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Specialists');
    specialists.value = res.data;
  } catch (err) {
    console.error('Error al cargar especialistas:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadSpecialists);

const createSpecialist = async () => {
  try {
    await api.post('/Specialists', newSpecialist.value);
    showModal.value = false;
    newSpecialist.value.name = '';
    newSpecialist.value.specialty = '';
    newSpecialist.value.email = '';
    await loadSpecialists();
  } catch (err) {
    alert('Error al registrar el especialista.');
  }
};

const deleteSpecialist = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este especialista?')) return;
  try {
    await api.delete(`/Specialists/${id}`);
    await loadSpecialists();
  } catch (err) {
    alert('No se pudo eliminar el especialista.');
  }
};
</script>