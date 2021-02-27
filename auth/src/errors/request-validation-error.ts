import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

class RequestValidationError extends CustomError {

  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('- LOG: Invalid request parameters.');
    //  Extending a built in class:
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => (
      { message: error.msg, field: error.param }
    ));
  }

}

export { RequestValidationError };
