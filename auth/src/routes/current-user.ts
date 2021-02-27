import { Router } from 'express';

const router = Router();

router.get('/api/users/current-user', (request, response) => {
  response.send('Hi there!');
});

export { router as currentUserRouter };
