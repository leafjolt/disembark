import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useTripsStore = defineStore('trips', () => {
  const trips = ref([])
  const currentTrip = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const getAuthHeader = () => {
    const authStore = useAuthStore()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }

  const fetchTrips = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'GET',
        headers: getAuthHeader()
      })
      if (!response.ok) throw new Error('Failed to fetch trips')
      trips.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchTrip = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        method: 'GET',
        headers: getAuthHeader()
      })
      if (!response.ok) throw new Error('Failed to fetch trip')
      currentTrip.value = await response.json()
      return currentTrip.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createTrip = async (title, startDate, endDate) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ title, startDate, endDate })
      })
      if (!response.ok) throw new Error('Failed to create trip')
      const newTrip = await response.json()
      trips.value.push(newTrip)
      return newTrip
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateTrip = async (id, title, startDate, endDate) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ title, startDate, endDate })
      })
      if (!response.ok) throw new Error('Failed to update trip')
      const updatedTrip = await response.json()
      const index = trips.value.findIndex(t => t._id === id)
      if (index !== -1) trips.value[index] = updatedTrip
      if (currentTrip.value?._id === id) currentTrip.value = updatedTrip
      return updatedTrip
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteTrip = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      if (!response.ok) throw new Error('Failed to delete trip')
      trips.value = trips.value.filter(t => t._id !== id)
      if (currentTrip.value?._id === id) currentTrip.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addEvent = async (tripId, event) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/events`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(event)
      })
      if (!response.ok) throw new Error('Failed to add event')
      const newEvent = await response.json()
      await fetchTrip(tripId)
      return newEvent
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateEvent = async (tripId, eventId, event) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/events/${eventId}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(event)
      })
      if (!response.ok) throw new Error('Failed to update event')
      await fetchTrip(tripId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteEvent = async (tripId, eventId) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/events/${eventId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      if (!response.ok) throw new Error('Failed to delete event')
      await fetchTrip(tripId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    trips,
    currentTrip,
    isLoading,
    error,
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    addEvent,
    updateEvent,
    deleteEvent
  }
})
