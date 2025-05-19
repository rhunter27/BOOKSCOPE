"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../server/models/User"));
const apollo_server_express_1 = require("apollo-server-express");
const auth_1 = require("auth");
const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (context.user) {
                return User_1.default.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new apollo_server_express_1.AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User_1.default.findOne({ email });
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new apollo_server_express_1.AuthenticationError('Incorrect credentials');
            }
            const token = (0, auth_1.signToken)({
                _id: user._id.toString(),
                email: user.email,
                username: user.username
            });
            return { token, user };
        },
        saveBook: async (_, { bookData }, context) => {
            if (context.user) {
                return User_1.default.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: bookData } }, { new: true, runValidators: true });
            }
            throw new apollo_server_express_1.AuthenticationError('You need to be logged in!');
        }
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map