import { currentUser } from '@tiddal/ticketing-common';
import { Router } from 'express';

const router = Router();

router.get('/api/users/current-user', currentUser, (request, response) => {
  response.send({ currentUser: request.user || null });
});

export { router as currentUserRouter };
