import { Publisher } from './publisher';
import { Subject } from './subject';
import { TicketCreatedEvent } from './ticket-created-event';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TICKET_CREATED;
}

export { TicketCreatedPublisher };
