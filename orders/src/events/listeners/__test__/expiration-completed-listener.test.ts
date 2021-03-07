import { ExpirationCompletedEvent, OrderStatus } from '@tiddal/ticketing-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompletedListener } from '../expiration-completed-listener';

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = new Ticket({
    _id: mongoose.Types.ObjectId().toHexString(),
    title: 'Test Show',
    price: 20
  });
  await ticket.save();

  const order = new Order({
    status: OrderStatus.CREATED,
    userId: 'randomUserId',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, order, data, message };
};

it('updates the order status to cancelled', async () => {
  const { listener, data, message, order } = await setup();
  await listener.onMessage(data, message);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
});

it('emits an OrderCancelled event', async () => {
  const { listener, data, message, order } = await setup();
  await listener.onMessage(data, message);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});
it('acknowledges the message', async () => {
  const { listener, data, message, } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
