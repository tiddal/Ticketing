import { Router, Request, Response } from 'express';

const router = Router();

router.delete('/api/orders/:id', async (request: Request, response: Response) => {
  response.send({});
});

export { router as cancelOrderRouter };
