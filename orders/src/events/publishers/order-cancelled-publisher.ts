import { OrderCancelledEvent, Publisher, Subject } from '@tiddal/ticketing-common';

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.ORDER_CANCELLED;
}

export { OrderCancelledPublisher };
