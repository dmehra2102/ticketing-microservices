import { model, Schema } from 'mongoose';
import { Password } from '../services/password';
import { UserAttrs, UserDoc, UserModel } from '../interfaces/user.interface';

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
      toJSON: {
         transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
         },
      },
   }
);

UserSchema.statics.build = (attrs: UserAttrs) => {
   return new User(attrs);
};

UserSchema.pre('save', async function (done) {
   if (this.isModified('password')) {
      const hashedPass = await Password.hashPassword(this.get('password'));
      this.set('password', hashedPass);
   }

   done();
});

const User = model<UserDoc, UserModel>('User', UserSchema);

export { User };
