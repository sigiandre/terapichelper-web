<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 py-12">
    <div class="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-emerald-400 tracking-wide">TerapicHelper</h1>
        <p class="text-sm text-slate-400 mt-2">Crea tu cuenta de paciente o especialista</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5">Nombre Completo</label>
          <input 
            v-model="name" 
            type="text" 
            required 
            class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5">Selecciona tu Rol</label>
          <select 
            v-model="role" 
            class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="Customer">Customer (Paciente)</option>
            <option value="Specialist">Specialist (Especialista)</option>
          </select>
        </div>

        <button 
          type="submit" 
          class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-emerald-600/30 mt-3"
        >
          Registrarse
        </button>

        <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
          {{ errorMessage }}
        </div>
      </form>

      <p class="text-sm text-center text-slate-400 mt-6">
        ¿Ya tienes cuenta? 
        <router-link to="/login" class="text-emerald-400 font-semibold hover:underline">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('Customer');
const errorMessage = ref('');

const handleRegister = async () => {
  try {
    errorMessage.value = '';
    await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
    });
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al registrar el usuario. Inténtalo de nuevo.';
  }
};
</script>