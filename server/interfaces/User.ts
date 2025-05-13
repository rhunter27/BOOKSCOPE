import { ObjectId } from 'mongodb';
import BookInput from './Book';


export default interface IUser {
    _id: ObjectId;
    email: string;
    username: string;
    savedBooks?: BookInput[];
    isCorrectPassword: (password: string) => Promise<boolean>;
  }