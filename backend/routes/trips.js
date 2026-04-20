const express = require('express')
const Trip = require('../models/Trip')
const auth = require('../middleware/auth')

const router = express.Router()

// All routes require authentication
router.use(auth)

// GET /api/trips - Get all trips for the logged-in user
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
    res.json(trips)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/trips - Create a new trip
router.post('/', async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body
    const trip = new Trip({
      userId: req.user.id,
      title,
      startDate,
      endDate,
      events: []
    })
    await trip.save()
    res.status(201).json(trip)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/trips/:id - Get a single trip with all its events
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id })
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }
    res.json(trip)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/trips/:id - Update trip metadata (title, dates, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, startDate, endDate },
      { new: true }
    )
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }
    res.json(trip)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/trips/:id - Delete a trip and all its events
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }
    res.json({ message: 'Trip deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/trips/:id/events - Add an event to a trip
router.post('/:id/events', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id })
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }
    const event = req.body
    trip.events.push(event)
    await trip.save()
    res.status(201).json(trip.events[trip.events.length - 1])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/trips/:id/events/:eid - Update a specific event
router.put('/:id/events/:eid', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id })
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }
    const event = trip.events.id(req.params.eid)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    Object.assign(event, req.body)
    await trip.save()
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/trips/:id/events/:eid - Remove a specific event from a trip
router.delete('/:id/events/:eid', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id })
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }
    const event = trip.events.id(req.params.eid)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    trip.events.pull(req.params.eid)
    await trip.save()
    res.json({ message: 'Event deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router