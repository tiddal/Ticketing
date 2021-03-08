import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/tickets', async (request: Request, response: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined
  });
  response.send(tickets);
});

export { router as indexTicketRouter };
