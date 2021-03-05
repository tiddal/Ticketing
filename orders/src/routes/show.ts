import { NotFoundError, requireAuth, UnauthorizedError } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { Order } from '../models/order';

const router = Router();

router.get(
  '/api/orders/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const order = await Order.findById(request.params.id).populate('ticket');
    if (!order) throw new NotFoundError();
    if (order.userId !== request.user!.id) throw new UnauthorizedError();
    response.send(order);
  });

export { router as showOrderRouter };
