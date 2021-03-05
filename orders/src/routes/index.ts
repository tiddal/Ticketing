import { requireAuth, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { Order } from '../models/order';

const router = Router();

router.get(
  '/api/orders',
  requireAuth,
  async (request: Request, response: Response) => {
    const orders = await Order.find({
      userId: request.user!.id
    }).populate('ticket');
    response.send(orders);
  });

export { router as indexOrderRouter };
