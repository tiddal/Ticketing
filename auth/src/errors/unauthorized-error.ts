import { CustomError } from './custom-error';

class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('- LOG: Not authorized.');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }

}

export { UnauthorizedError };
