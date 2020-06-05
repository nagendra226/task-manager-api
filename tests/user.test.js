const request = require('supertest');
const { app } = require('../src/app');
const { User } = require('../src/models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOne = {
  name: 'Mike',
  age: 45,
  email: 'Mike1@gmail.com',
  password: '5689@wWe',
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// afterEach(() => {
//   console.log('after Each');
// });

test('Should signup a new user', async () => {
  await request(app).post('/users').send(userOne).expect(201);
});

test('Should signin a user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test('Should not login non existent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: '5689@wWe1',
    })
    .expect(400);
});
