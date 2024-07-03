const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then(p => {
    if (p) {
      response.json(p)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

personRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
    important: false
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => {
    next(error)
  })
})

personRouter.put('/:id', (request, response) => {
  const { name, number, important } = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number, important },
    { new: true, runValidators: true, context: 'query' }
  ).then(updatedItem => {
    response.json(updatedItem)
  }).catch(error => next(error))
})

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedItem => {
    response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = personRouter