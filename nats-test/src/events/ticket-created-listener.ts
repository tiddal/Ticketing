import { Message } from 'node-nats-streaming';
import { Listener } from './listener';
import { Subject } from './subject';
import { TicketCreatedEvent } from './ticket-created-event';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TICKET_CREATED;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], message: Message): void {
    console.log('Event data!', data);
    message.ack();
  }
}

export { TicketCreatedListener };
