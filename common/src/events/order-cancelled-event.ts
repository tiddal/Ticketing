import { Subject } from './subject';

interface OrderCancelledEvent {
  subject: Subject.ORDER_CANCELLED;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}

export { OrderCancelledEvent };
