import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';


// Interface for TypeScript type checking
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: Array<{
    bookId: string;
    authors: string[];
    description?: string;
    title: string;
    image?: string;
    link?: string;
  }>;
  // Methods
  isCorrectPassword(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

// Book subdocument schema
const BookSchema = new Schema({
  bookId: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});

// Main user schema
const LocalUserSchema = new Schema<IUser, IUserModel>({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  savedBooks: [BookSchema],
});

// Hash password before saving
LocalUserSchema.pre<IUser>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare and validate password
LocalUserSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Create and export the model
const User: IUserModel = model<IUser, IUserModel>('User', LocalUserSchema);
export default User;