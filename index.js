
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const PORT = process.env.PORT || 3001

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456",
      "important": false
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "important": false
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "important": false
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "important": false
    }
]

app.use(morgan('tiny'))

app.get('/info', (request, response) => {
    response.send(`<h4>Phonebook has info for ${persons.length} people</h4><h4>${Date(Date.now())}</h4>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const getUniqueId = () => {
    const id = Math.max(...persons.map(p => p.id))
    return id + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        response.status(400).json({
            error: 'Missing name value'
        })
    }
    const person = {
        id: getUniqueId(),
        name: body.name,
        number: body.number,
        important: false
    }
    persons = persons.concat(person)
    response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.body.id
    const person = persons.find(p => p.id === id)
    person.important = !person.important
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})