import { OrderStatus } from '@tiddal/ticketing-common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('cancels an order', async () => {
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

  await request(app)
    .patch(`/api/orders/${id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.CANCELLED);

});

it('emits an order:cancelled event', async () => {

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

  await request(app)
    .patch(`/api/orders/${id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
