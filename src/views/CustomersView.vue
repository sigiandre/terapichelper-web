<template>
  <div class="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-y-auto p-8 space-y-6">
      <div class="flex items-center justify-between bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 class="text-2xl font-bold text-white">Gestión de Pacientes</h2>
          <p class="text-sm text-slate-400 mt-1">Directorio y expedientes de pacientes registrados en la clínica.</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20">
          + Nuevo Paciente
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Cargando pacientes...</div>
        <div v-else-if="customers.length === 0" class="p-8 text-center text-slate-400">No hay pacientes registrados en el sistema.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th class="p-4">ID</th>
                <th class="p-4">Nombre Completo</th>
                <th class="p-4">Correo Electrónico</th>
                <th class="p-4">Teléfono</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/70 text-sm">
              <tr v-for="c in customers" :key="c.customerId || c.customersId" class="hover:bg-slate-700/30 transition">
                <td class="p-4 font-mono text-slate-400">#{{ c.customerId || c.customersId }}</td>
                <td class="p-4 font-medium text-white">{{ c.name || c.fullName }}</td>
                <td class="p-4 text-slate-300">{{ c.email || 'No registrado' }}</td>
                <td class="p-4 text-slate-300">{{ c.phone || 'No registrado' }}</td>
                <td class="p-4 text-right">
                  <button @click="deleteCustomer(c.customerId || c.customersId)" class="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Registrar Nuevo Paciente</h3>
        <form @submit.prevent="createCustomer" class="space-y-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Nombre Completo</label>
            <input v-model="newCustomer.name" type="text" required placeholder="Ej. Juan Pérez" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Correo Electrónico</label>
            <input v-model="newCustomer.email" type="email" placeholder="correo@ejemplo.com" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Teléfono</label>
            <input v-model="newCustomer.phone" type="text" placeholder="+51 999 999 999" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">Guardar Paciente</button>
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

const customers = ref([]);
const loading = ref(true);
const showModal = ref(false);

const newCustomer = ref({
  name: '',
  email: '',
  phone: ''
});

const loadCustomers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/Customers');
    customers.value = res.data;
  } catch (err) {
    console.error('Error al cargar pacientes:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadCustomers);

const createCustomer = async () => {
  try {
    await api.post('/Customers', newCustomer.value);
    showModal.value = false;
    newCustomer.value.name = '';
    newCustomer.value.email = '';
    newCustomer.value.phone = '';
    await loadCustomers();
  } catch (err) {
    alert('Error al registrar el paciente.');
  }
};

const deleteCustomer = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este paciente?')) return;
  try {
    await api.delete(`/Customers/${id}`);
    await loadCustomers();
  } catch (err) {
    alert('No se pudo eliminar el paciente.');
  }
};
</script>