<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Inventario de Equipos y Aparatos</h2>
          <p class="text-sm text-slate-400 mt-1">Control de equipamiento, estado y mantenimiento para las sesiones de terapia.</p>
        </div>
        <div class="flex gap-3">
          <button @click="exportToCSV" class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2">
            📥 Exportar CSV
          </button>
          <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition">
            + Nuevo Equipo
          </button>
        </div>
      </div>

      <!-- TABLA DE EQUIPOS -->
      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Cargando equipos...</div>
        <div v-else-if="equipments.length === 0" class="p-8 text-center text-slate-400">No hay equipos registrados en el inventario.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th class="p-4">ID</th>
                <th class="p-4">Nombre del Equipo</th>
                <th class="p-4">Categoría / Tipo</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/70 text-sm">
              <tr v-for="eq in equipments" :key="eq.id || eq.equipmentId" class="hover:bg-slate-700/30 transition">
                <td class="p-4 font-mono text-slate-400">#{{ eq.id || eq.equipmentId }}</td>
                <td class="p-4 font-medium text-white">{{ eq.name }}</td>
                <td class="p-4 text-slate-300">{{ eq.category || 'General' }}</td>
                <td class="p-4">
                  <span :class="eq.status === 'Disponible' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" class="px-2.5 py-1 rounded-full text-xs font-medium border">
                    {{ eq.status || 'Disponible' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <button @click="deleteEquipment(eq.id || eq.equipmentId)" class="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal Nuevo Equipo -->
    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Registrar Nuevo Equipo</h3>
        <form @submit.prevent="createEquipment" class="space-y-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Nombre del Aparato / Equipo</label>
            <input v-model="newEq.name" type="text" required placeholder="Ej. Ultrasonido Terapéutico / Camilla hidráulica" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Categoría</label>
            <input v-model="newEq.category" type="text" placeholder="Ej. Electroterapia" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Estado</label>
            <select v-model="newEq.status" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm">
              <option value="Disponible">Disponible</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="En Uso">En Uso</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Equipo</button>
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

const equipments = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newEq = ref({ name: '', category: '', status: 'Disponible' });

const loadEquipments = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Equipments');
    equipments.value = res.data;
  } catch (err) {
    console.error('Error al cargar equipos:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadEquipments();
});

const createEquipment = async () => {
  try {
    await api.post('/Equipments', {
      name: newEq.value.name.trim(),
      category: newEq.value.category ? newEq.value.category.trim() : 'General',
      status: newEq.value.status
    });
    showModal.value = false;
    newEq.value.name = '';
    newEq.value.category = '';
    newEq.value.status = 'Disponible';
    await loadEquipments();
    alert('¡Equipo registrado con éxito!');
  } catch (err) {
    alert('Error al registrar el equipo.');
  }
};

const deleteEquipment = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este equipo?')) return;
  try {
    await api.delete(`/Equipments/${id}`);
    await loadEquipments();
  } catch (err) {
    alert('No se pudo eliminar el equipo.');
  }
};

const exportToCSV = () => {
  if (equipments.value.length === 0) {
    alert('No hay datos disponibles para exportar.');
    return;
  }
  
  const headers = ['ID', 'Nombre del Equipo', 'Categoria', 'Estado'];
  const rows = equipments.value.map(eq => [
    eq.id || eq.equipmentId,
    `"${eq.name}"`,
    `"${eq.category || 'General'}"`,
    `"${eq.status || 'Disponible'}"`
  ]);
  
  const csvContent = 'data:text/csv;charset=utf-8,' + [
    headers.join(','), 
    ...rows.map(e => e.join(','))
  ].join('\n');
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'reporte_equipos_terapichelper.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>