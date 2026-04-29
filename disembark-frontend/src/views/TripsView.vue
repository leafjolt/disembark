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

<style scoped>
.trips-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.header h1 {
  margin: 0;
}

.logout-btn {
  padding: 8px 16px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #f0f0f0;
  border-color: #d5d5d7;
}

.new-trip-btn {
  padding: 12px 24px;
  background-color: var(--secondary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 32px;
  transition: all 0.2s ease;
}

.new-trip-btn:hover {
  background-color: #31a14a;
}

.new-trip-btn:active {
  background-color: #2a8a3e;
}

.form-section {
  background-color: var(--bg-secondary);
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 40px;
  border: 1px solid var(--border);
}

.form-section h2 {
  margin-top: 0;
}

form div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

input {
  width: 100%;
  padding: 12px 16px;
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-section button {
  padding: 12px 24px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 16px;
}

.form-section button:hover:not(:disabled) {
  background-color: #0062CC;
}

.form-section button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading, .no-trips {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  font-size: 16px;
}

.trips-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.trip-card {
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trip-card:hover {
  border-color: var(--primary);
  box-shadow: 0 12px 30px rgba(0, 122, 255, 0.1);
  transform: translateY(-4px);
}

.trip-card h3 {
  margin: 0 0 12px 0;
  color: var(--primary);
  font-size: 18px;
}

.trip-card p {
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.event-count {
  color: #999;
  font-size: 13px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
</style>
