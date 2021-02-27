import { CustomError } from './custom-error';

class DatabaseConnectionError extends CustomError {

  statusCode = 500;
  reason = 'Error connecting to the database';

  constructor() {
    super('- LOG: Error connecting to the database.');
    //  Extending a built in class:
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }

}

export { DatabaseConnectionError };
