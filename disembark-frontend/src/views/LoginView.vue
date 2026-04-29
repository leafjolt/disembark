<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/trips')
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

<template>
  <div class="auth-container">
    <div>
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Email:</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input v-model="form.password" type="password" required />
        </div>
        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg);
  padding: 20px;
}

.auth-container > div {
  width: 100%;
  max-width: 380px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: var(--text-primary);
}

form div {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

input {
  width: 100%;
  padding: 12px 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

button {
  width: 100%;
  padding: 14px 16px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 24px;
}

button:hover:not(:disabled) {
  background-color: #0062CC;
}

button:active:not(:disabled) {
  background-color: #0052AB;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: var(--danger);
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
}

p {
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
  color: var(--text-secondary);
}

a {
  color: var(--primary);
  font-weight: 500;
}

a:hover {
  color: var(--primary-light);
}
</style>
