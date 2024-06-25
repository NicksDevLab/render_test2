
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))

require('dotenv').config()

const PORT = process.env.PORT || 3001

console.log('Express Middleware Stack:');
app._router.stack.forEach((middleware, index) => {
    if (middleware.route) {
        // This is a route
        console.log(`${index}: Route - ${middleware.route.path}`)
    } else if (middleware.name === 'router') {
        // This is a router middleware
        console.log(`${index}: Router - ${middleware.regexp}`)
        middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
            console.log(`  Nested Route - ${handler.route.path}`)
        } else {
            console.log(`  Nested Middleware - ${handler.name}`)
        }
        });
    } else {
        // This is a regular middleware
        console.log(`${index}: Middleware - ${middleware.name}`)
    }
})

app.get('/info', (request, response) => {
    response.send(`<h4>Phonebook has info for ${persons.length} people</h4><h4>${Date(Date.now())}</h4>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(p => {
        if (p) {
            response.json(p)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

app.put('/api/persons/:id', (request, response) => {
    const { name, number, important } = request.body
    const updateData = {
        important: important,
    }
    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number, important}, 
        { new: true, runValidators: true, context: 'query'}
    ).then(updatedItem => {
        response.json(updatedItem)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedItem => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error('THIS ERROR: ', error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log('response in errorHandler - ', error.message)
        response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})