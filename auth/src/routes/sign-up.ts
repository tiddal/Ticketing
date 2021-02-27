import { Router } from 'express';

const router = Router();

router.post('/api/users/sign-up', (request, response) => {
  const { email, password } = request.body;
});

export { router as signUpRouter };
