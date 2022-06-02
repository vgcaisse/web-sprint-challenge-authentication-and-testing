const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db('users').truncate();
})

describe('user model', () => {
  it('shows empty table', async () => {
    const users = await db('users');
    expect(users).toHaveLength(0);
  })
})

describe('server handles a register endpoint', () => {
  it('[POST] /register ', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Peet Sasafras', password: '1234' });

    expect(res.status).toBe(201)
  })

  it('[POST] /register should show credentials on successful registration ', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Peet Sasafras', password: 'foobar' });

    expect(res.body).toHaveProperty('username', 'Peet Sasafras');
  })

  it('[POST] /login should return error message on failed login', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Peet Sasafras', password: 'foobar' });

    expect(res.body).toMatchObject({ message: 'Invalid credentials' });
  })

  it('[POST] /login should return error message if no username or password is entered', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: '' });

    expect(res.body).toMatchObject({ message: 'Invalid credentials' });
  })

  it('[POST] /login should return error message if no password is entered', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Peet Sasafras', password: '' });

    expect(res.body).toMatchObject({ message: 'Invalid credentials' });
  })

  it('[POST] /login should return error message if no username is entered', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: '1234' });

    expect(res.body).toMatchObject({ message: 'Invalid credentials' });
  })

  it('[GET] / does not show jokes ', async () => {
    let res = await request(server).get('/api/jokes');
    expect(res.body).toMatchObject({ message: 'token required' })
  })

  it('[GET] / shows correct status on failed login ', async () => {
    let res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
  })
})
