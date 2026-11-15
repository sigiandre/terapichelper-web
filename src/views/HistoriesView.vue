<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Historiales Clínicos</h2>
          <p class="text-sm text-slate-400 mt-1">Revisa el seguimiento de atenciones por paciente y sesión[cite: 12].</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
          + Nuevo Historial
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Cargando historiales...</div>
        <div v-else-if="histories.length === 0" class="p-8 text-center text-slate-400">No hay historiales clínicos registrados.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th class="p-4">ID Paciente</th>
                <th class="p-4">ID Sesión</th>
                <th class="p-4">Fecha y Hora (Watched)</th>
                <th class="p-4">Notas</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/70 text-sm">
              <tr v-for="h in histories" :key="`${h.customersId}-${h.sessionsId}`" class="hover:bg-slate-700/30 transition">
                <td class="p-4 font-mono text-slate-400">#{{ h.customersId }}</td>
                <td class="p-4 font-mono text-slate-400">#{{ h.sessionsId }}</td>
                <td class="p-4 text-slate-300">{{ new Date(h.watched).toLocaleString() }}</td>
                <td class="p-4 text-slate-200">{{ h.notes || 'Sin notas' }}</td>
                <td class="p-4 text-right">
                  <button @click="deleteHistory(h.customersId, h.sessionsId)" class="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Registrar Historial Clínico</h3>
        <form @submit.prevent="createHistory" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">ID Paciente</label>
              <input v-model.number="newHistory.customersId" type="number" min="1" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">ID Sesión</label>
              <input v-model.number="newHistory.sessionsId" type="number" min="1" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Fecha y Hora (Watched)</label>
            <input v-model="newHistory.watched" type="datetime-local" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Notas</label>
            <textarea v-model="newHistory.notes" rows="3" placeholder="Observaciones clínicas de la sesión..." class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Historial</button>
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

const histories = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newHistory = ref({
  customersId: 1,
  sessionsId: 1,
  watched: new Date().toISOString().slice(0, 16),
  notes: ''
});

const loadHistories = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Histories');
    histories.value = res.data;
  } catch (err) {
    console.error('Error al cargar historiales:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadHistories);

const createHistory = async () => {
  try {
    const payload = {
      customersId: Number(newHistory.value.customersId),
      sessionsId: Number(newHistory.value.sessionsId),
      watched: new Date(newHistory.value.watched).toISOString(),
      notes: newHistory.value.notes.trim()
    };

    await api.post('/Histories', payload);
    showModal.value = false;
    newHistory.value.notes = '';
    await loadHistories();
  } catch (err) {
    console.error(err);
    alert('Error al registrar el historial clínico.');
  }
};

const deleteHistory = async (customersId, sessionsId) => {
  if (!confirm('¿Seguro que deseas eliminar este historial?')) return;
  try {
    await api.delete(`/Histories/${customersId}/${sessionsId}`);
    await loadHistories();
  } catch (err) {
    alert('No se pudo eliminar el historial.');
  }
};
</script>