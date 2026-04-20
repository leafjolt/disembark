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


