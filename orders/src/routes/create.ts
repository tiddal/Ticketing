import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .withMessage('A ticket id must be provided')
  ],
  validateRequest,
  async (request: Request, response: Response) => {

    const { ticketId } = request.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const ticketIsReserved = await ticket.isReserved();
    if (ticketIsReserved) throw new BadRequestError('Ticket is already reserved');

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = new Order({
      userId: request.user!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket
    });

    await order.save();

    response.status(201).send(order);
  }
);

export { router as createOrderRouter };



