import { DatabaseConnectionError, requireAuth, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { startSession } from 'mongoose';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post('/api/tickets', requireAuth,
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

    const { title, price } = request.body;
    const { id: userId } = request.user!;

    const ticket = new Ticket({
      title,
      price,
      userId
    });

    const session = await startSession();
    session.startTransaction();
    try {
      await ticket.save();
      await new TicketCreatedPublisher(natsWrapper.client).publish({
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
    response.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
