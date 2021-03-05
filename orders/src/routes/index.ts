import { requireAuth, validateRequest } from '@tiddal/ticketing-common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

const router = Router();

router.get('/api/orders', async (request: Request, response: Response) => {
  response.send({});
});

export { router as indexOrderRouter };
