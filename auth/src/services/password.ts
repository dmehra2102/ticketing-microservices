import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';

const scryptAsync = promisify(scrypt);

export class Password {
   static async hashPassword(password: string): Promise<string> {
      const salt = randomBytes(8).toString('hex');
      const buff = (await scryptAsync(password, salt, 64)) as Buffer;

      return `${buff.toString('hex')}.${salt}`;
   }

   static async comaparePassword(
      storedPassword: string,
      password: string
   ): Promise<boolean> {
      const [existingHashedPass, salt] = storedPassword.split('.');
      const givenHashedPass = (await scryptAsync(password, salt, 64)) as Buffer;
      return existingHashedPass === givenHashedPass.toString('hex');
   }
}
