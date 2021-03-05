import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signIn())
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the does not own the ticket', async () => {

  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(201);

  const ticketId = createTicketResponse.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signIn())
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(401);


});

it('returns a 400 if the user provides an invalid title or price for the ticket', async () => {
  const cookie = global.signIn();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(201);

  const ticketId = response.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Show',
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      price: 20
    })
    .expect(400);
});

it('updates the ticket when provided valid inputs', async () => {
  const cookie = global.signIn();

  const [title, price] = ['Test Comedy Show', 10];

  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(201);

  const ticketId = createTicketResponse.body.id;

  const updatedTicketResponse = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(200);

  expect(updatedTicketResponse.body.title).toEqual(title);
  expect(updatedTicketResponse.body.price).toEqual(price);
});

it('publishes an event', async () => {

  const cookie = global.signIn();

  const [title, price] = ['Test Comedy Show', 10];

  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test Show',
      price: 20
    })
    .expect(201);

  const ticketId = createTicketResponse.body.id;

  const updatedTicketResponse = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(200);
    
  expect(natsWrapper.client.publish).toHaveBeenCalled()

}) 
