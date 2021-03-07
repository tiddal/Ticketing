import { Subject } from './subject';

interface ExpirationCompletedEvent {
  subject: Subject.EXPIRATION_COMPLETED;
  data: {
    orderId: string;
  };
}

export { ExpirationCompletedEvent };
