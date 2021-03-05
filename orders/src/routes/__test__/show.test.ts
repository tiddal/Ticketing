import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  const ticket = new Ticket({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signIn();

  const { body: { id } } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(id);
});


it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = new Ticket({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signIn();

  const { body: { id } } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signIn())
    .send()
    .expect(401);

});

