require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then((result) => {
    const numPersons = result.length
    const requestTime = new Date()
    response.send(`
  <p>Phone book has info for ${numPersons} people</p>
    <p>${requestTime}</p>
    `)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'missing name or number',
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => next(error))
  }
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then((person) => {
    if (person) {
      return response.json(person)
    } else {
      return response.status(404).end()
    }
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.deleteOne({ _id: id }).then((result) => {
    response.status(204).end()
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
 
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status.send({ error: 'malformed id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`)
})
