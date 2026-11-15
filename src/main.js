import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

import './style.css' // <--- Añade esta línea para que cargue los estilos globales

const app = createApp(App)
app.use(router)
app.mount('#app')