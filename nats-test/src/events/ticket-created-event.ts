import { Subject } from './subject';

interface TicketCreatedEvent {
  subject: Subject.TICKET_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

export { TicketCreatedEvent };
