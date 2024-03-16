import mongoose, { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserFields, UserMethods, UserModel } from '../types';
import { randomUUID } from 'crypto';

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema<UserFields, UserModel, UserMethods>({
  email: {
    type: String,
    required: [true, 'Email must be provided!'],
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<UserFields>,
        email: string,
      ): Promise<boolean> {
        if (!this.isModified('email')) return true;
        const user: HydratedDocument<UserFields> | null = await User.findOne({
          email: email,
        });
        return !user;
      },
      message: 'This user is already registered!',
    },
  },
  displayName: {
    type: String,
    required: [true, 'Name must be provided!'],
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty!'],
  },
  token: {
    type: String,
    required: [true, 'Token must be provided!'],
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
  googleID: String,
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', UserSchema);
export default User;
