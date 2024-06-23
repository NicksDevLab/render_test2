
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person').default

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

require('dotenv').config()

const PORT = process.env.PORT || 3001

app.use(morgan('tiny'))

app.get('/info', (request, response) => {
    response.send(`<h4>Phonebook has info for ${persons.length} people</h4><h4>${Date(Date.now())}</h4>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(p => {
        response.json(p)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        response.status(400).json({
            error: 'Missing name value'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
        important: false
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const updateData = {
        important: request.body.important,
    }
    Person.findByIdAndUpdate(id, updateData, {
        new: true,
    }).then(updatedItem => {
        if (updatedItem) {
          response.status(200).json(updatedItem);
        } else {
          response.status(404).json({ message: 'Item not found' });
        }
    }).catch(error => {
      console.error('Error updating item:', error);
      response.status(500).json({ message: 'Internal server error' });
    });
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(deletedItem => {
        if (deletedItem) {
          response.status(200).json({ message: 'Item deleted successfully', deletedItem });
        } else {
          response.status(404).json({ message: 'Item not found' });
        }
    }).catch(error => {
        console.error('Error deleting item:', error);
        response.status(500).json({ message: 'Internal server error' });
    });
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})