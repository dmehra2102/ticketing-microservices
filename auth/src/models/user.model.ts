import { model, Schema } from 'mongoose';
import { UserDoc, UserModel } from '../interfaces/user.interface';

const UserSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

const User = model<UserDoc,UserModel>('User', UserSchema);

export { User };