const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const request = supertest(app)

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'User One',
  email: 'user1@example.com',
  password: 'Pa55w0rd!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany()
  await User(userOne).save()
})

test('should create a new user', async () => {
  const response = await request.post('/users').send({
    name: 'Test One',
    email: 'test1@example.com',
    password: 'Test One Pa55w0rd!'
  }).expect(201)
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()
  expect(await bcrypt.compare('Test One Pa55w0rd!', user.password)).toBeTruthy()
  expect(response.body).toMatchObject({
    user: {
      name: 'Test One',
      email: 'test1@example.com'
    },
    token: user.tokens[0].token
  })
})

test('should login an existing user', async () => {
  const { email, password } = userOne
  const response = await request.post('/users/login').send({
    email,
    password
  }).expect(200)
  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('should fail to login an incorrect user', async () => {
  await request.post('/users/login').send({
    email: 'wrong@example.com',
    password: 'wrong123!'
  }).expect(400)
})

test('should get profile for user with valid jwt', async () => {
  const response = await request.get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()
  expect(response.body).toMatchObject({
    user: {
      name: 'User One',
      email: 'user1@example.com'
    },
    token: userOne.tokens[0].token
  })
})

test('should not get profile without a valid jwt', async () => {
  await request.get('/users/me')
    .send()
    .expect(401)
})

test('should not delete profile without a valid jwt', async () => {
  await request.delete('/users/me')
    .send()
    .expect(401)
})

test('should delete profile for user with valid jwt', async () => {
  const response = await request.delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const user = await User.findById(response.body._id)
  expect(user).toBeNull()
})

afterAll(() => {
  mongoose.connection.close()
})
