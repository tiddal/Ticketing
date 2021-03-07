import { ExpirationCompletedEvent, Listener, OrderStatus, Subject } from '@tiddal/ticketing-common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subject.EXPIRATION_COMPLETED;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompletedEvent['data'], message: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) throw new Error('Order not found');
    order.set({
      status: OrderStatus.CANCELLED
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    message.ack();
  }
}

export { ExpirationCompletedListener };
