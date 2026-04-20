<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '../stores/trips'

const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()

onMounted(() => {
  tripsStore.fetchTrip(route.params.id)
})

const sortedEvents = computed(() => {
  if (!tripsStore.currentTrip) return []
  return [...tripsStore.currentTrip.events].sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })
})

const goBack = () => {
  router.push('/trips')
}

const addEvent = () => {
  router.push({ name: 'EventEdit', params: { id: route.params.id } })
}

const editEvent = (eventId) => {
  router.push({ name: 'EventEditExisting', params: { id: route.params.id, eid: eventId } })
}

const deleteEvent = async (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await tripsStore.deleteEvent(route.params.id, eventId)
    } catch (err) {
      console.error('Failed to delete event:', err)
    }
  }
}
</script>

<template>
  <div class="itinerary-container">
    <div class="header">
      <button @click="goBack" class="back-btn">← Back</button>
      <h1>{{ tripsStore.currentTrip?.title || 'Trip' }}</h1>
    </div>

    <div v-if="tripsStore.currentTrip" class="trip-info">
      <p><strong>Duration:</strong> {{ tripsStore.currentTrip.startDate.split('T')[0] }} to {{ tripsStore.currentTrip.endDate.split('T')[0] }}</p>
    </div>

    <button @click="addEvent" class="add-event-btn">+ Add Event</button>

    <div v-if="tripsStore.isLoading" class="loading">Loading itinerary...</div>

    <div v-if="!tripsStore.isLoading && sortedEvents.length === 0" class="no-events">
      No events yet. Add one to build your itinerary!
    </div>

    <div class="events-list">
      <div v-for="event in sortedEvents" :key="event._id" class="event-card">
        <div class="event-header">
          <h3>{{ event.title }}</h3>
          <span class="event-type">{{ event.type }}</span>
        </div>
        <p class="event-date">{{ event.date.split('T')[0] }} at {{ event.time }}</p>
        <p v-if="event.notes" class="event-notes">{{ event.notes }}</p>
        
        <div class="event-details">
          <div v-if="event.airline" class="detail">✈️ {{ event.airline }} {{ event.flightNumber }}</div>
          <div v-if="event.from && event.to" class="detail">📍 {{ event.from }} → {{ event.to }}</div>
          <div v-if="event.confirmationCode" class="detail">🎫 {{ event.confirmationCode }}</div>
          <div v-if="event.address && event.type !== 'transport'" class="detail">📍 {{ event.address }}</div>
          <div v-if="event.checkIn" class="detail">Check-in: {{ event.checkIn.split('T')[0] }}</div>
          <div v-if="event.checkOut" class="detail">Check-out: {{ event.checkOut.split('T')[0] }}</div>
          <div v-if="event.cost" class="detail">💰 {{ event.cost }} {{ event.currency }}</div>
        </div>

        <div class="event-actions">
          <button @click="editEvent(event._id)" class="edit-btn">Edit</button>
          <button @click="deleteEvent(event._id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>


