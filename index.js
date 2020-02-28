require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const Schedule = require('./database/schedule')
const Slot = require('./database/slot')
const Ticket = require('./database/ticket')
const { BadRequest } = require('./libs/error')

const app = express()
app.use(express.json())

app.post('/schedule', async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Schedule collection
    const data = {
      name: req.body.name,
      quota: req.body.quota,
      departure: DateTime.fromFormat(req.body.departure, 'yyyy-MM-dd HH:mm ZZZ').toJSDate()
    }
    const schedule = await Schedule.create([data], { session })

    // Slot collection
    const slots = [...Array(data.quota).keys()].map(i => ({
      scheduleId: schedule[0]._id,
      seatNumber: i + 1
    }))
    await Slot.create(slots, { session })

    await session.commitTransaction()
    res.json({ data: schedule[0] })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
})

app.post('/ticket', async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Find slot
    const query = {
      scheduleId: req.body.scheduleId,
      seatNumber: req.body.seatNumber,
      available: true
    }
    const slot = await Slot.findOneAndUpdate(query, {
      $set: {
        bookedBy: req.body.passengerId,
        available: false
      }
    }, { useFindAndModify: false })
    if (!slot) throw new BadRequest('Slot is not available')

    // Create ticket
    const ticket = await Ticket.create([{
      seatNumber: req.body.seatNumber,
      passengerId: req.body.passengerId,
      scheduleId: req.body.scheduleId,
      slotId: slot._id
    }], { session })

    await session.commitTransaction()
    res.json({ message: 'Ticket is successfully booked', ticket: ticket[0] })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
})

app.use(require('./libs/errorHandler'))

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(async () => {
  console.log('Connected to MongoDB')

  console.log('Initiating collections')
  await Schedule.createCollection()
  await Slot.createCollection()
  await Ticket.createCollection()

  app.listen(process.argv[2], () => console.log(`Ticketing API listening on port ${process.argv[2]}!`))
}).catch(() => {
  console.log('MongoDB connection failed.')
})
