import { Listener, OrderStatus, PaymentCreatedEvent, Subject } from '@tiddal/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
  readonly subject = Subject.PAYMENT_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error('Order not found');
    order.set({
      status: OrderStatus.COMPLETED
    });
    await order.save();

    message.ack();
  }
}

export { PaymentCreatedListener };
