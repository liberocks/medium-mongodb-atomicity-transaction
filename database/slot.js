const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  scheduleId: { type: mongoose.ObjectId },
  seatNumber: { type: Number, required: true },
  available: { type: Boolean, default: true },
  bookedBy: { type: mongoose.ObjectId, default: null }
})

module.exports = mongoose.model('Slot', schema)
