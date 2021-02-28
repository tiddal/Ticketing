import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
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
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

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
