import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const currentUser = (request: Request, response: Response, next: NextFunction) => {
  if (!request.session?.jwt) return next();
  try {
    const payload = jwt.verify(request.session.jwt, process.env.JWT_KEY!) as UserPayload;
    request.user = payload;
  } catch (error) { }
  next();
};

export { currentUser };
