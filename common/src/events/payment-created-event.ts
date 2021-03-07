import { Subject } from './subject';

interface PaymentCreatedEvent {
  subject: Subject.PAYMENT_CREATED;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}

export { PaymentCreatedEvent };
