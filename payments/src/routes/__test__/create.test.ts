import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@tiddal/ticketing-common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

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

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signIn(userId);
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.CREATED
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const { id: stripeId } = await (stripe.charges.create as jest.Mock).mock.results[0].value;

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId
  });

  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(stripeId);

});

