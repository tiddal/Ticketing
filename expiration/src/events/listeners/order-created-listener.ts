import { Listener, OrderCreatedEvent, Subject } from '@tiddal/ticketing-common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  readonly subject = Subject.ORDER_CREATED;
  queueGroupName = 'expiration-service';

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay}ms to process the job.`);
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    });
    message.ack();
  }
}

export { OrderCreatedListener };
