import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

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
  (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    console.log('Creating an user...');
    throw new DatabaseConnectionError();
    response.send({});
  });

export { router as signUpRouter };
