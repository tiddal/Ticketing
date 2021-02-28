import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await global.signUp();
  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: 'incorrect'
    })
    .expect(400);
});

it('response with a cookie when successful sign in', async () => {
  await global.signUp();
  const response = await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test.com',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an empty password', async () => {
  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: ''
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com'
    })
    .expect(400);

  await request(app)
    .post('/api/users/sign-in')
    .send({
      password: 'password'
    })
    .expect(400);

  await request(app)
    .post('/api/users/sign-in')
    .send({})
    .expect(400);
});


