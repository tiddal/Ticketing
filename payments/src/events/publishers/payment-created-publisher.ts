import { PaymentCreatedEvent, Publisher, Subject } from '@tiddal/ticketing-common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  readonly subject = Subject.PAYMENT_CREATED;
}

export { PaymentCreatedPublisher };
