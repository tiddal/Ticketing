import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized-error';

const requireAuth = (request: Request, response: Response, next: NextFunction) => {
  if (!request.user) throw new UnauthorizedError();
  next();
};

export { requireAuth };
