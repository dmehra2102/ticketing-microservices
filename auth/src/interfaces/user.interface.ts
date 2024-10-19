import mongoose from 'mongoose';

// An interface that defines the propeerites that are rquired to create a new user
export interface UserAttrs {
   email: string;
   password: string;
}

// An interface that defines the properties that a User Document has
export interface UserDoc extends mongoose.Document {
   email: string;
   password: string;
   updatedAt: string;
   createdAt: string;
}

// An interface that defines the properties that a User Model has
export interface UserModel extends mongoose.Model<UserDoc> {
   build(attrs: UserAttrs): UserDoc;
}
