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

<style scoped>
.itinerary-container {
  max-width: 900px;
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

.trip-info {
  background-color: var(--bg-secondary);
  padding: 16px 20px;
  border-radius: 10px;
  margin-bottom: 28px;
  color: var(--text-secondary);
  font-size: 14px;
  border: 1px solid var(--border);
}

.add-event-btn {
  padding: 12px 24px;
  background-color: var(--secondary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 32px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.add-event-btn:hover {
  background-color: #31a14a;
}

.loading, .no-events {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  font-size: 16px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-card {
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.2s ease;
}

.event-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.event-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 17px;
}

.event-type {
  background-color: var(--bg-secondary);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: capitalize;
  font-weight: 500;
}

.event-date {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 8px 0;
}

.event-notes {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 12px 0;
  font-style: italic;
}

.event-details {
  background-color: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 0;
  border-left: 3px solid var(--primary);
}

.detail {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 6px 0;
  line-height: 1.5;
}

.event-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.edit-btn, .delete-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn {
  background-color: var(--primary);
  color: white;
  flex: 1;
}

.edit-btn:hover {
  background-color: #0062CC;
}

.delete-btn {
  background-color: #f5f5f7;
  color: var(--danger);
  border: 1px solid #f0f0f0;
  flex: 1;
}

.delete-btn:hover {
  background-color: #fff;
  border-color: #e0e0e0;
}
</style>
