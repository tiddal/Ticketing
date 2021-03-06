import { Subject } from './subject';

interface OrderCancelledEvent {
  subject: Subject.ORDER_CANCELLED;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}

export { OrderCancelledEvent };
