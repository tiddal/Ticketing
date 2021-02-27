import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

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

    if (!errors.isEmpty()) return response.status(400).send(errors.array());

    const { email, password } = request.body;

    console.log('Creating an user...');
    response.send({});
  });

export { router as signUpRouter };
