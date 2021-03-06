import { Schema, Document, model } from 'mongoose';
import { PasswordManager } from '../services/password-manager';

interface UserAttributes {
  email: string;
  password: string;
}

type UserDocument = Document & UserAttributes;

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

const UserModel = model<UserDocument>('User', userSchema);

class User extends UserModel {
  constructor(attributes: UserAttributes) {
    super(attributes);
  }
}

export { User };
