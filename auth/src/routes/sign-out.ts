import { Router } from 'express';

const router = Router();

router.post('/api/users/sign-out', (request, response) => {
  response.send('Hi there!');
});

export { router as signOutRouter };
