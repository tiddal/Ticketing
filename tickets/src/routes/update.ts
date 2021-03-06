import { DatabaseConnectionError, NotFoundError, requireAuth, UnauthorizedError, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { startSession } from 'mongoose';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.put('/api/tickets/:id', requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ], validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) throw new NotFoundError();
    if (ticket.userId !== request.user!.id) throw new UnauthorizedError();

    ticket.set({
      title: request.body.title,
      price: request.body.price
    });

    const session = await startSession();
    session.startTransaction();
    try {
      await ticket.save();
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
      });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      session.endSession();
    }
    response.send(ticket);
  }
);

export { router as updateTicketRouter };
