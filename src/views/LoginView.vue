<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4">
    <div class="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-blue-400 tracking-wide">TerapicHelper</h1>
        <p class="text-sm text-slate-400 mt-2">Inicia sesión para gestionar tus terapias</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-blue-600/30 mt-2"
        >
          Ingresar
        </button>

        <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
          {{ errorMessage }}
        </div>
      </form>

      <p class="text-sm text-center text-slate-400 mt-8">
        ¿Aún no tienes cuenta? 
        <router-link to="/register" class="text-blue-400 font-semibold hover:underline">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    errorMessage.value = '';
    await authService.login({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión. Comprueba tus datos.';
  }
};
</script>