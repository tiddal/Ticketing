import { Listener, OrderCreatedEvent, Subject } from '@tiddal/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  readonly subject = Subject.ORDER_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const order = new Order({
      _id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });
    await order.save();

    message.ack();
  }
}


export { OrderCreatedListener };
