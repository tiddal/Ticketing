import { BadRequestError, validateRequest } from '@tiddal/ticketing-common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

const router = Router();

router.post(
  '/api/users/sign-up',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters long')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError('This email already in use.');

    const user = new User({ email, password });
    await user.save();

    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    request.session = { jwt: userJwt };

    response.status(201).send(user);

  });

export { router as signUpRouter };
