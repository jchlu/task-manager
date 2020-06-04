const supertest = require('supertest')
const app = require('../src/app')
const mongoose = require('mongoose')
const User = require('../src/models/user')

const request = supertest(app)
const userOne = {
  name: 'User One',
  email: 'user1@example.com',
  password: 'Pa55w0rd!'
}

beforeEach(async () => {
  await User.deleteMany()
  await User(userOne).save()
})

test('should create a new user', async () => {
  await request.post('/users').send({
    name: 'Test One',
    email: 'test1@example.com',
    password: 'Pa55w0rd!'
  }).expect(201)
})

test('should login an existing user', async () => {
  const { email, password } = userOne
  await request.post('/users/login').send({
    email,
    password
  }).expect(200)
})

test('should fail to login an incorrect user', async () => {
  await request.post('/users/login').send({
    email: 'wrong@example.com',
    password: 'wrong123!'
  }).expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
