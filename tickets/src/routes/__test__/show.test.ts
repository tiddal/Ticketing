import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  await request(app)
    .get('/api/tickets/fake_id')
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {

  const title = 'Test Show';
  const price = 10;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .send({ title, price })
    .expect(201);

  const findTicketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(findTicketResponse.body.title).toEqual(title);
  expect(findTicketResponse.body.price).toEqual(price);
});
