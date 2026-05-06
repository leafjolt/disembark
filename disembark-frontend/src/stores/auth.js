import { defineStore } from 'pinia'
import { ref } from 'vue'

// Environment-aware API URL configuration
const getApiUrl = () => {
  // Use Vite's environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Fallback based on environment
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api'
  }

  // Production fallback - should be set via .env.production
  return 'https://your-deployed-backend-url.com/api'
}

const API_URL = getApiUrl()

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const register = async (email, password, firstName, lastName) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Registration failed')
      }
      return await response.json()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Login failed')
      }
      const data = await response.json()
      token.value = data.token
      localStorage.setItem('token', data.token)
      user.value = { email }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => !!token.value

  return {
    token,
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    isAuthenticated
  }
})
