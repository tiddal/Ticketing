import { NotFoundError, requireAuth, UnauthorizedError, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

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
    await ticket.save();
    response.send(ticket);
  }
);

export { router as updateTicketRouter };
