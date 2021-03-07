import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@tiddal/ticketing-common';

it('returns a 404 when trying to purchase an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signIn())
    .send({
      token: 'randomToken',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});


it('returns a 401 when trying to purchase an order that does not belong to the user', async () => {
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.CREATED
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signIn())
    .send({
      token: 'randomToken',
      orderId: order.id
    })
    .expect(401);


});

it('returns a 400 when trying to purchase an order that has already been cancelled', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signIn(userId);
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.CANCELLED
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'randomToken',
      orderId: order.id
    })
    .expect(400);
});
