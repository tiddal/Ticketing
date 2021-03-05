import { Publisher, OrderCreatedEvent, Subject } from '@tiddal/ticketing-common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.ORDER_CREATED;
}

export { OrderCreatedPublisher };
