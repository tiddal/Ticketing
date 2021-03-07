import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

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

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });

    response.status(201).send(order);
  }
);

export { router as createOrderRouter };



