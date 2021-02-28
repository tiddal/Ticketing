import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  const signUpCookie = await global.signUp();

  const response = await request(app)
    .post('/api/users/sign-out')
    .send({})
    .expect(200);

  const signOutCookie = response.get('Set-Cookie');

  expect(signUpCookie).not.toEqual(signOutCookie);
});
