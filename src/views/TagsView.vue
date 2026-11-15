<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Gestión de Etiquetas</h2>
          <p class="text-sm text-slate-400 mt-1">Clasifica y organiza los recursos clínicos del sistema.</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
          + Nueva Etiqueta
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Cargando etiquetas...</div>
        <div v-else-if="tags.length === 0" class="p-8 text-center text-slate-400">No hay etiquetas registradas.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th class="p-4">ID</th>
                <th class="p-4">Nombre de la Etiqueta</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/70 text-sm">
              <tr v-for="t in tags" :key="t.tagId || t.tagsId" class="hover:bg-slate-700/30 transition">
                <td class="p-4 font-mono text-slate-400">#{{ t.tagId || t.tagsId }}</td>
                <td class="p-4 font-medium text-white">
                  <span class="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold">{{ t.name }}</span>
                </td>
                <td class="p-4 text-right">
                  <button @click="deleteTag(t.tagId || t.tagsId)" class="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Registrar Nueva Etiqueta</h3>
        <form @submit.prevent="createTag" class="space-y-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Nombre de la Etiqueta</label>
            <input v-model="newTag.name" type="text" required placeholder="Ej. Dolor Agudo / Lumbalgia" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Etiqueta</button>
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

const tags = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newTag = ref({
  name: ''
});

const loadTags = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Tags');
    tags.value = res.data;
  } catch (err) {
    console.error('Error al cargar etiquetas:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadTags);

const createTag = async () => {
  try {
    await api.post('/Tags', newTag.value);
    showModal.value = false;
    newTag.value.name = '';
    await loadTags();
  } catch (err) {
    alert('Error al registrar la etiqueta.');
  }
};

const deleteTag = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta etiqueta?')) return;
  try {
    await api.delete(`/Tags/${id}`);
    await loadTags();
  } catch (err) {
    alert('No se pudo eliminar la etiqueta.');
  }
};
</script>