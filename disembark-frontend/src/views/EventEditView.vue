<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '../stores/trips'

const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()

const form = ref({
  type: 'activity',
  title: '',
  date: '',
  time: '',
  notes: '',
  airline: '',
  flightNumber: '',
  from: '',
  to: '',
  confirmationCode: '',
  checkIn: '',
  checkOut: '',
  address: '',
  cost: '',
  currency: 'USD'
})

const isEditing = computed(() => !!route.params.eid)

onMounted(async () => {
  if (isEditing.value) {
    await tripsStore.fetchTrip(route.params.id)
    const event = tripsStore.currentTrip.events.find(e => e._id === route.params.eid)
    if (event) {
      // Format the ISO date string to YYYY-MM-DD for the date input
      const eventDate = new Date(event.date)
      const formattedDate = eventDate.toISOString().split('T')[0]
      
      // Format checkIn and checkOut dates if they exist
      const formattedCheckIn = event.checkIn ? new Date(event.checkIn).toISOString().split('T')[0] : ''
      const formattedCheckOut = event.checkOut ? new Date(event.checkOut).toISOString().split('T')[0] : ''
      
      form.value = { 
        ...event,
        date: formattedDate,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut
      }
    }
  }
})

const goBack = () => {
  router.push({ name: 'Itinerary', params: { id: route.params.id } })
}

const handleSubmit = async () => {
  try {
    // Convert dates back to ISO format if they're in YYYY-MM-DD format
    const eventData = { ...form.value }
    if (eventData.date && !eventData.date.includes('T')) {
      eventData.date = new Date(eventData.date + 'T' + (eventData.time || '00:00')).toISOString()
    }
    
    // Convert checkIn and checkOut if they exist
    if (eventData.checkIn && !eventData.checkIn.includes('T')) {
      eventData.checkIn = new Date(eventData.checkIn + 'T00:00').toISOString()
    }
    if (eventData.checkOut && !eventData.checkOut.includes('T')) {
      eventData.checkOut = new Date(eventData.checkOut + 'T00:00').toISOString()
    }
    
    if (isEditing.value) {
      await tripsStore.updateEvent(route.params.id, route.params.eid, eventData)
    } else {
      await tripsStore.addEvent(route.params.id, eventData)
    }
    goBack()
  } catch (err) {
    console.error('Failed to save event:', err)
  }
}
</script>

<template>
  <div class="event-edit-container">
    <div class="header">
      <button @click="goBack" class="back-btn">← Back</button>
      <h1>{{ isEditing ? 'Edit Event' : 'Add Event' }}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="event-form">
      <div class="form-group">
        <label>Event Type:</label>
        <select v-model="form.type" required>
          <option value="activity">Activity</option>
          <option value="transport">Transport</option>
          <option value="accommodation">Accommodation</option>
        </select>
      </div>

      <div class="form-group">
        <label>Title:</label>
        <input v-model="form.title" type="text" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Date:</label>
          <input v-model="form.date" type="date" required />
        </div>
        <div class="form-group">
          <label>Time:</label>
          <input v-model="form.time" type="time" required />
        </div>
      </div>

      <div class="form-group">
        <label>Notes:</label>
        <textarea v-model="form.notes" rows="3"></textarea>
      </div>

      <!-- Transport fields -->
      <div v-if="form.type === 'transport'" class="section">
        <h3>Transport Details</h3>
        <div class="form-group">
          <label>Airline:</label>
          <input v-model="form.airline" type="text" />
        </div>
        <div class="form-group">
          <label>Flight Number:</label>
          <input v-model="form.flightNumber" type="text" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>From:</label>
            <input v-model="form.from" type="text" />
          </div>
          <div class="form-group">
            <label>To:</label>
            <input v-model="form.to" type="text" />
          </div>
        </div>
        <div class="form-group">
          <label>Confirmation Code:</label>
          <input v-model="form.confirmationCode" type="text" />
        </div>
      </div>

      <!-- Accommodation fields -->
      <div v-if="form.type === 'accommodation'" class="section">
        <h3>Accommodation Details</h3>
        <div class="form-group">
          <label>Address:</label>
          <input v-model="form.address" type="text" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Check-in Date:</label>
            <input v-model="form.checkIn" type="date" />
          </div>
          <div class="form-group">
            <label>Check-out Date:</label>
            <input v-model="form.checkOut" type="date" />
          </div>
        </div>
      </div>

      <!-- Activity fields -->
      <div v-if="form.type === 'activity'" class="section">
        <h3>Activity Details</h3>
        <div class="form-group">
          <label>Location/Address:</label>
          <input v-model="form.address" type="text" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Cost:</label>
            <input v-model="form.cost" type="number" step="0.01" />
          </div>
          <div class="form-group">
            <label>Currency:</label>
            <input v-model="form.currency" type="text" placeholder="USD" />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="tripsStore.isLoading">
          {{ tripsStore.isLoading ? 'Saving...' : (isEditing ? 'Update Event' : 'Add Event') }}
        </button>
        <button type="button" @click="goBack" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.event-edit-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
}

.back-btn {
  padding: 8px 12px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 44px;
}

.back-btn:hover {
  background-color: #f0f0f0;
  border-color: #d5d5d7;
}

.header h1 {
  margin: 0;
  flex: 1;
}

.event-form {
  background-color: var(--bg);
  padding: 32px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

input, select, textarea {
  width: 100%;
  padding: 12px 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.section {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 10px;
  margin: 24px 0;
  border-left: 4px solid var(--primary);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
}

.section h3 {
  margin-top: 0;
  color: var(--primary);
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: var(--secondary);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background-color: #31a14a;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.cancel-btn:hover {
  background-color: #f0f0f0;
  border-color: #d5d5d7;
}
</style>
