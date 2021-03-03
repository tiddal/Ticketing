import { NotFoundError } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/tickets/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError();
  response.send(ticket);
});

export { router as showTicketRouter };
