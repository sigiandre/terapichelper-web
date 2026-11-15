<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Gestión de Sesiones</h2>
          <p class="text-sm text-slate-400 mt-1">Programa, consulta y administra las citas de fisioterapia y teleconsultas.</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
          + Agendar Sesión
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="loading" class="col-span-full text-center py-12 text-slate-400">Cargando sesiones...</div>
        <div v-else-if="sessions.length === 0" class="col-span-full text-center py-12 text-slate-400">No hay sesiones programadas.</div>
        <div v-else v-for="s in sessions" :key="s.sessionId || s.sessionsId" class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg">#{{ s.sessionId || s.sessionsId }}</span>
              <span class="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{{ s.status || 'Programada' }}</span>
            </div>
            <h3 class="text-lg font-bold text-white">{{ s.title }}</h3>
            <p class="text-sm text-slate-400 mt-1 line-clamp-2">{{ s.description || 'Sin descripción adicional.' }}</p>
          </div>

          <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 space-y-2 text-xs text-slate-300">
            <div class="flex justify-between">
              <span class="text-slate-400">Fecha:</span>
              <span class="font-medium text-white">{{ s.startDate?.split('T')[0] }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Horario:</span>
              <span class="font-medium text-white">{{ s.startHour?.slice(0, 5) }} - {{ s.endHour?.slice(0, 5) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Paciente / Especialista:</span>
              <span class="font-medium text-white">ID {{ s.customersId }} / ID {{ s.specialistsId }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <span class="text-xs text-slate-400">{{ s.meetingUrl ? 'Teleconsulta' : 'Presencial' }}</span>
            <button @click="deleteSession(s.sessionId || s.sessionsId)" class="text-xs font-medium text-red-400 hover:text-red-300 transition">Eliminar</button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Agendar Nueva Sesión</h3>
        <form @submit.prevent="createSession" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">ID Paciente</label>
              <input v-model.number="newSession.customersId" type="number" min="1" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">ID Especialista</label>
              <input v-model.number="newSession.specialistsId" type="number" min="1" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Título de la Sesión</label>
            <input v-model="newSession.title" type="text" required placeholder="Ej. Rehabilitación de Columna" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Descripción / Indicaciones</label>
            <textarea v-model="newSession.description" rows="2" placeholder="Ej. Ejercicios de estiramiento..." class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Fecha</label>
              <input v-model="newSession.startDate" type="date" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Estado</label>
              <select v-model="newSession.status" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm">
                <option value="Programada">Programada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Hora Inicio</label>
              <input v-model="newSession.startHour" type="time" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Hora Fin</label>
              <input v-model="newSession.endHour" type="time" required class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">URL de Teleconsulta (Opcional)</label>
            <input v-model="newSession.meetingUrl" type="text" placeholder="https://meet.google.com/..." class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Sesión</button>
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

const sessions = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newSession = ref({
  customersId: 1,
  specialistsId: 1,
  title: '',
  description: '',
  startDate: '',
  startHour: '09:00',
  endHour: '10:00',
  meetingUrl: '',
  status: 'Programada'
});

const loadSessions = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Sessions');
    sessions.value = res.data;
  } catch (err) {
    console.error('Error al cargar sesiones:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadSessions);

const createSession = async () => {
  try {
    let formattedDate = newSession.value.startDate;
    if (formattedDate && formattedDate.includes('/')) {
      const parts = formattedDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const payload = {
      customersId: Number(newSession.value.customersId),
      specialistsId: Number(newSession.value.specialistsId),
      title: newSession.value.title.trim(),
      description: newSession.value.description ? newSession.value.description.trim() : "",
      startDate: formattedDate,
      startHour: newSession.value.startHour,
      endHour: newSession.value.endHour,
      meetingUrl: newSession.value.meetingUrl ? newSession.value.meetingUrl.trim() : "",
      status: newSession.value.status
    };

    await api.post('/Sessions', payload);
    showModal.value = false;
    newSession.value.title = '';
    newSession.value.description = '';
    newSession.value.meetingUrl = '';
    await loadSessions();
    alert('¡Sesión creada con éxito!');
  } catch (error) {
    console.error('Detalle completo del error:', error.response?.data);
    const errorMsg = error.response?.data?.errors 
      ? JSON.stringify(error.response.data.errors) 
      : (error.response?.data?.title || error.message);
    alert('Error al crear la sesión: ' + errorMsg);
  }
};

const deleteSession = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta sesión?')) return;
  try {
    await api.delete(`/Sessions/${id}`);
    await loadSessions();
  } catch (err) {
    alert('No se pudo eliminar la sesión.');
  }
};
</script>