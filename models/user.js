const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    contacts: [],
    passwordHash: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = userSchema