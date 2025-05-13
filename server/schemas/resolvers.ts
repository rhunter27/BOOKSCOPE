import User from '../../server/models/User';
import { AuthenticationError } from 'apollo-server-express';
import { ObjectId } from 'mongoose';
import { signToken } from 'auth';
import Context from '../interfaces/Context';
import IUser from '../interfaces/User';
import BookInput from '../interfaces/Book';

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
    
  },
  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email }) as IUser;
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken({
        _id: user._id.toString(),
        email: user.email,
        username: user.username
      });
      return { token, user };
    },
    saveBook: async (_: any, { bookData }: { bookData: BookInput }, context: Context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

export default resolvers;