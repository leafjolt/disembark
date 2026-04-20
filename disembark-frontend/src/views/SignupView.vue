<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await authStore.register(
      form.value.email,
      form.value.password,
      form.value.firstName,
      form.value.lastName
    )
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

<template>
  <div class="auth-container">
    <div>
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>First Name:</label>
          <input v-model="form.firstName" type="text" required />
        </div>
        <div>
          <label>Last Name:</label>
          <input v-model="form.lastName" type="text" required />
        </div>
        <div>
          <label>Email:</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input v-model="form.password" type="password" required />
        </div>
        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Signing up...' : 'Sign Up' }}
        </button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

