import { Publisher, Subject, TicketCreatedEvent } from '@tiddal/ticketing-common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TICKET_CREATED;
}

export { TicketCreatedPublisher };
