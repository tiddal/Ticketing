import { Listener, OrderCancelledEvent, Subject } from '@tiddal/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';


class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subject.ORDER_CANCELLED;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], message: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error('Ticket not found');
    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });
    message.ack();
  }
}

export { OrderCancelledListener };
