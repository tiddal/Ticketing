import { Router, Request, Response } from 'express';

const router = Router();

router.get('/api/orders/:id', async (request: Request, response: Response) => {
  response.send({});
});

export { router as showOrderRouter };
