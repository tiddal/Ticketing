import { BadRequestError, NotFoundError, OrderStatus, requireAuth, UnauthorizedError, validateRequest } from '@tiddal/ticketing-common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { token, orderId } = request.body;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== request.user!.id) throw new UnauthorizedError();
    if (order.status === OrderStatus.CANCELLED) throw new BadRequestError('Cannot pay for a cancelled order');
    response.send({ success: true });
  }
);

export { router as createChargeRouter };
