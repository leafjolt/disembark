const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['transport', 'accommodation', 'activity']
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  // Transport specific
  airline: String,
  flightNumber: String,
  from: String,
  to: String,
  confirmationCode: String,
  // Accommodation specific
  checkIn: Date,
  checkOut: Date,
  address: String,
  // Activity specific
  cost: Number,
  currency: String
}, { _id: true })

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  events: [eventSchema]
}, {
  timestamps: true
})

module.exports = mongoose.model('Trip', tripSchema)