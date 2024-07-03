const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('testing api for users', () => {
    test('create new user login', async () => {
        const newUser = {
            name: 'nick church', 
            username: 'nickisgreat',
            password: 'password1'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        console.log('RESPONSE - ', response)
    })
})