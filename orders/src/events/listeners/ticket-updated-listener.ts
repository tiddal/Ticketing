import { Message } from 'node-nats-streaming';
import { Listener, Subject, TicketUpdatedEvent } from '@tiddal/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TICKET_UPDATED;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
    const { id, price, title } = data;
    const ticket = await Ticket.findOne({
      _id: id,
      version: data.version - 1
    });
    if (!ticket) throw new Error('Ticket not found');
    ticket.set({ title, price });
    await ticket.save();
    message.ack();
  }
}

export { TicketUpdatedListener };
