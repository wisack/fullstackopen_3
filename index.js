const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :body'))
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
require('dotenv').config()
const Person = require('./models/person')

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(pers => {
    response.json(pers)
  })
    .catch(error => next(error))})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({ type: 'name' }).then(c =>
    response.send(`<div>Phonebook has info for ${c} people<br />${date}</div>`))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(pers => {
    if (pers) {
      response.json(pers)
    }else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  /*
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }
    */
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedNote => {
    response.json(savedNote)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const pers = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, pers, { runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'SyntaxError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})