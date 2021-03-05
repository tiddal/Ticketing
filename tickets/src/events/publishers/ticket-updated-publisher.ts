import { Publisher, Subject, TicketUpdatedEvent } from '@tiddal/ticketing-common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subject.TICKET_UPDATED;
}

export { TicketUpdatedPublisher };
