const supertest = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase, teardownDatabase } = require('./fixtures/db')

const request = supertest(app)

beforeEach(async () => {
  await setupDatabase()
})

test('should create an new task for a logged in user', async () => {
  const description = 'Make sausages for tea'
  const response = await request
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description })
    .expect(201)
  const task = await Task.findById(response.body._id)
  expect(task.description).toEqual(description)
  expect(task.completed).toEqual(false)
  expect(task.owner).toEqual(userOneId)
})

test('should be able to retrieve two tasks for userOne saved in the database', async () => {
  const response = await request
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(response.body).toHaveLength(2)
})

afterAll(async () => {
  await teardownDatabase()
})
