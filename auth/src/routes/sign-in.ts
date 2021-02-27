import { Router } from 'express';

const router = Router();

router.post('/api/users/sign-in', (request, response) => {
  response.send('Hi there!');
});

export { router as signInRouter };
