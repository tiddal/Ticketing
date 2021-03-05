import { Router, Request, Response } from 'express';

const router = Router();

router.post('/api/orders', async (request: Request, response: Response) => {
  response.send({});
});

export { router as createOrderRouter };
