import { Router } from 'express';

const router = Router();

router.post('/api/users/sign-out', (request, response) => {
  request.session = null;
  response.send({});
});

export { router as signOutRouter };
