const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  seatNumber: { type: Number, required: true },
  passengerId: { type: mongoose.ObjectId, required: true },
  scheduleId: { type: mongoose.ObjectId, required: true },
  slotId: { type: mongoose.ObjectId, required: true }
})

module.exports = mongoose.model('Ticket', schema)
