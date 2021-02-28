import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { PasswordManager } from '../services/password-manager';

const router = Router();

router.post('/api/users/sign-in',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError('Invalid credentials');
    const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
    if (!passwordsMatch) throw new BadRequestError('Invalid credentials');

    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    request.session = { jwt: userJwt };

    response.status(200).send(existingUser);
  }
);

export { router as signInRouter };
