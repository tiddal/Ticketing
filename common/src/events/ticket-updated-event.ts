import { Subject } from './subject';

interface TicketUpdatedEvent {
  subject: Subject.TICKET_UPDATED;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

export { TicketUpdatedEvent };
