import { Router } from 'express';
import { currentUser } from '../middlewares/current-user';

const router = Router();

router.get('/api/users/current-user', currentUser, (request, response) => {
  response.send({ currentUser: request.user || null });
});

export { router as currentUserRouter };
