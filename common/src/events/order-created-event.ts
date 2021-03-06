import { Subject } from './subject';
import { OrderStatus } from './types/order-status';

interface OrderCreatedEvent {
  subject: Subject.ORDER_CREATED;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export { OrderCreatedEvent };
