const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  name: { type: String, required: true },
  quota: { type: Number, required: true },
  departure: { type: Date, required: true }
})

module.exports = mongoose.model('Schedule', schema)
