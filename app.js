const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const morgan = require('morgan')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use('/api/persons', personRouter)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

logger.info('Express Middleware Stack:')
app._router.stack.forEach((middleware, index) => {
  if (middleware.route) {
    // This is a route
    logger.info(`${index}: Route - ${middleware.route.path}`)
  } else if (middleware.name === 'router') {
    // This is a router middleware
    logger.info(`${index}: Router - ${middleware.regexp}`)
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        logger.info(`  Nested Route - ${handler.route.path}`)
      } else {
        logger.info(`  Nested Middleware - ${handler.name}`)
      }
    })
  } else {
    // This is a regular middleware
    logger.info(`${index}: Middleware - ${middleware.name}`)
  }
})

module.exports = app