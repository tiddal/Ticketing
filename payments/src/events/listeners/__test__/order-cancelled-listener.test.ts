import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from '@tiddal/ticketing-common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.CREATED,
    userId: 'randomUserId',
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'randomTicketId',
    }
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, order };
};

it('updates the status of the order', async () => {
  const { listener, data, message, order } = await setup();
  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);

});

it('acknowledges the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
