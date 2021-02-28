import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/api/users/current-user', (request, response) => {
  if (!request.session?.jwt) return response.send({ currentUser: null });
  try {
    const payload = jwt.verify(request.session.jwt, process.env.JWT_KEY!);
    response.send({ currentUser: payload });
  }
  catch (error) { response.send({ currentUser: null }); }
});

export { router as currentUserRouter };
