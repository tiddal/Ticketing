import { Message } from 'node-nats-streaming';
import { Listener, Subject, TicketCreatedEvent } from '@tiddal/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TICKET_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], message: Message) {
    const { id, title, price } = data;
    const ticket = new Ticket({
      _id: id,
      title,
      price
    });
    await ticket.save();
    message.ack();
  }
}

export { TicketCreatedListener };
