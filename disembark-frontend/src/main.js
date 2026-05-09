import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { useTripsStore } from './stores/trips'

const pinia = createPinia();

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

useAuthStore();
useTripsStore();
