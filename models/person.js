

require('dotenv').config()

import { set, connect, Schema, model } from 'mongoose'
set('strictQuery',false)

const url = process.env.MONGODB_URL
console.log('connecting to ', url)

connect(url)
    .then(result => {
        console.log('connected to MongoDB', result)
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const personSchema = new Schema({
  name: String,
  number: String,
  important: Boolean,
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default model('Person', personSchema)