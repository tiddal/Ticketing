import { ExpirationCompletedEvent, Publisher, Subject } from '@tiddal/ticketing-common';

class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
  readonly subject = Subject.EXPIRATION_COMPLETED;
}

export { ExpirationCompletedPublisher };
