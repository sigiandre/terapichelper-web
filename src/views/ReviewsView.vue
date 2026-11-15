<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Reseñas y Valoraciones</h2>
          <p class="text-sm text-slate-400 mt-1">Calificaciones y comentarios de los pacientes sobre la atención clínica.</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
          + Nueva Reseña
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Cargando reseñas...</div>
        <div v-else-if="reviews.length === 0" class="p-8 text-center text-slate-400">No hay reseñas registradas en el sistema.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th class="p-4">ID</th>
                <th class="p-4">Paciente / Especialista</th>
                <th class="p-4">Calificación (Rank)</th>
                <th class="p-4">Descripción / Comentario</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/70 text-sm">
              <tr v-for="r in reviews" :key="r.reviewId || r.reviewsId" class="hover:bg-slate-700/30 transition">
                <td class="p-4 font-mono text-slate-400">#{{ r.reviewId || r.reviewsId }}</td>
                <td class="p-4 text-slate-300">ID {{ r.customersId }} / ID {{ r.specialistsId }}</td>
                <td class="p-4">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    ⭐ {{ r.rank }} / 5
                  </span>
                </td>
                <td class="p-4 text-slate-300">{{ r.description || 'Sin comentarios' }}</td>
                <td class="p-4 text-right">
                  <button @click="deleteReview(r.reviewId || r.reviewsId)" class="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Registrar Nueva Reseña</h3>
        <form @submit.prevent="createReview" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">ID Paciente</label>
              <input v-model.number="newReview.customersId" type="number" min="1" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">ID Especialista</label>
              <input v-model.number="newReview.specialistsId" type="number" min="1" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Calificación (Rank)</label>
            <select v-model.number="newReview.rank" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm">
              <option :value="5">⭐⭐⭐⭐⭐ (5 - Excelente)</option>
              <option :value="4">⭐⭐⭐⭐ (4 - Muy bueno)</option>
              <option :value="3">⭐⭐⭐ (3 - Bueno)</option>
              <option :value="2">⭐⭐ (2 - Regular)</option>
              <option :value="1">⭐ (1 - Malo)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Descripción / Comentario</label>
            <textarea v-model="newReview.description" rows="3" placeholder="Opinión del paciente sobre la atención..." class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Reseña</button>
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

const reviews = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newReview = ref({
  customersId: 1,
  specialistsId: 1,
  rank: 5,
  description: ''
});

const loadReviews = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Reviews');
    reviews.value = res.data;
  } catch (err) {
    console.error('Error al cargar reseñas:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadReviews);

const createReview = async () => {
  try {
    const payload = {
      customersId: Number(newReview.value.customersId),
      specialistsId: Number(newReview.value.specialistsId),
      rank: Number(newReview.value.rank),
      description: newReview.value.description ? newReview.value.description.trim() : ""
    };

    await api.post('/Reviews', payload);
    showModal.value = false;
    newReview.value.description = '';
    await loadReviews();
  } catch (err) {
    console.error(err);
    alert('Error al registrar la reseña.');
  }
};

const deleteReview = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return;
  try {
    await api.delete(`/Reviews/${id}`);
    await loadReviews();
  } catch (err) {
    alert('No se pudo eliminar la reseña.');
  }
};
</script>