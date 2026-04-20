<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTripsStore } from '../stores/trips'

const router = useRouter()
const authStore = useAuthStore()
const tripsStore = useTripsStore()

const showNewTripForm = ref(false)
const newTripForm = ref({
  title: '',
  startDate: '',
  endDate: ''
})

onMounted(() => {
  tripsStore.fetchTrips()
})

const handleCreateTrip = async () => {
  try {
    await tripsStore.createTrip(
      newTripForm.value.title,
      newTripForm.value.startDate,
      newTripForm.value.endDate
    )
    showNewTripForm.value = false
    newTripForm.value = { title: '', startDate: '', endDate: '' }
  } catch (err) {
    console.error('Failed to create trip:', err)
  }
}

const goToTrip = (tripId) => {
  router.push({ name: 'Itinerary', params: { id: tripId } })
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="trips-container">
    <div class="header">
      <h1>My Trips</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <button @click="showNewTripForm = !showNewTripForm" class="new-trip-btn">
      {{ showNewTripForm ? 'Cancel' : '+ New Trip' }}
    </button>

    <div v-if="showNewTripForm" class="form-section">
      <h2>Create New Trip</h2>
      <form @submit.prevent="handleCreateTrip">
        <div>
          <label>Trip Title:</label>
          <input v-model="newTripForm.title" type="text" required />
        </div>
        <div>
          <label>Start Date:</label>
          <input v-model="newTripForm.startDate" type="date" required />
        </div>
        <div>
          <label>End Date:</label>
          <input v-model="newTripForm.endDate" type="date" required />
        </div>
        <button type="submit" :disabled="tripsStore.isLoading">
          {{ tripsStore.isLoading ? 'Creating...' : 'Create Trip' }}
        </button>
      </form>
    </div>

    <div v-if="tripsStore.isLoading" class="loading">Loading trips...</div>

    <div v-if="!tripsStore.isLoading && tripsStore.trips.length === 0" class="no-trips">
      No trips yet. Create one to get started!
    </div>

    <div class="trips-list">
      <div v-for="trip in tripsStore.trips" :key="trip._id" class="trip-card" @click="goToTrip(trip._id)">
        <h3>{{ trip.title }}</h3>
        <p>{{ trip.startDate.split('T')[0] }} to {{ trip.endDate.split('T')[0] }}</p>
        <p class="event-count">{{ trip.events.length }} events</p>
      </div>
    </div>
  </div>
</template>
