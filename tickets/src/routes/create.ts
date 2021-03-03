import { requireAuth, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

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

    await ticket.save();

    response.status(201).send(ticket);
  });

export { router as createTicketRouter };
