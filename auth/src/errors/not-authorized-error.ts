import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
   statusCode: number = 401;

   constructor() {
      super('You are not authorized!');

      Object.setPrototypeOf(this, NotAuthorizedError.prototype);
   }

   serializeErrors(): { message: string; field?: string }[] {
      return [{ message: 'You are not authorized!' }];
   }
}
