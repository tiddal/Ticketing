import { OrderCreatedEvent, OrderStatus } from '@tiddal/ticketing-common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'randomDate',
    userId: 'randomUserId',
    status: OrderStatus.CREATED,
    ticket: {
      id: 'randomTicketId',
      price: 10
    }
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message };
};

it('replicates the order info', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acknowledges the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
