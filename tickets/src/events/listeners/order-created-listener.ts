import { Listener, OrderCreatedEvent, Subject } from '@tiddal/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.ORDER_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error('Ticket not found');
    ticket.set({ orderId: data.id });
    await ticket.save();
    message.ack();
  }
}

export { OrderCreatedListener };
