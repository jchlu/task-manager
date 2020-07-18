const supertest = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOneId,
  userOne,
  setupDatabase,
  teardownDatabase,
} = require('./fixtures/db')

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

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
