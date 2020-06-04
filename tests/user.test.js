const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase, teardownDatabase } = require('./fixtures/db')

const request = supertest(app)

beforeEach(async () => {
  await setupDatabase()
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
    .expect(200)
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()
  expect(response.body).toMatchObject({
    user: {
      name: 'Gene Hunt',
      email: 'genegenie@example.com'
    },
    token: userOne.tokens[0].token
  })
})

test('should not get profile without a valid jwt', async () => {
  await request.get('/users/me')
    .expect(401)
})

test('should not delete profile without a valid jwt', async () => {
  await request.delete('/users/me')
    .expect(401)
})

test('should delete profile for user with valid jwt', async () => {
  const response = await request.delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  const user = await User.findById(response.body._id)
  expect(user).toBeNull()
})

test('should upload and process an avatar for a logged in user', async () => {
  // grab a file from fixtures
  await request.post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/43ad73db1d0320cb2eb2dc5924dca63e9952d080.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
  const name = 'Sausage Dog'
  await request.patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toBe(name)
})

test('should not update invalid user fields', async () => {
  const location = 'Las Terrenas'
  await request.patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location })
    .expect(400)
})

test('should not update if user not logged in', async () => {
  const name = 'Sausage Dog'
  await request.patch('/users/me')
    .set('Authorization', 'Bearer ')
    .send({ name })
    .expect(401)
})

afterAll(async () => {
  await teardownDatabase()
})
