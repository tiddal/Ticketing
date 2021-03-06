import { NotFoundError, OrderStatus, requireAuth, UnauthorizedError } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.patch(
  '/api/orders/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const order = await Order.findById(request.params.id).populate('ticket');
    if (!order) throw new NotFoundError();
    if (order.userId !== request.user!.id) throw new UnauthorizedError();
    order.status = OrderStatus.CANCELLED;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    response.sendStatus(204);
  });

export { router as cancelOrderRouter };
