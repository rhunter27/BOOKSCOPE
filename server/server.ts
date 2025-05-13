import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

// 1. Environment Setup
dotenv.config();

// 2. Type Definitions
interface UserTokenPayload {
  _id: string;
  email: string;
  username: string;
  iat?: number;  // JWT issued-at timestamp
  exp?: number;  // JWT expiration timestamp
}

interface GraphQLContext {
  user?: UserTokenPayload;
}

// 3. Express Application
const app: express.Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// 4. Authentication Middleware
const authenticate = (token: string): UserTokenPayload | undefined => {
  try {
    if (!token) return undefined;
    return jwt.verify(token, process.env.JWT_SECRET!) as UserTokenPayload;
  } catch (err) {
    console.error('Authentication error:', err);
    return undefined;
  }
};

// 5. Database Connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

// 6. Apollo Server Setup
const startApolloServer = async () => {
  await connectDB();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): GraphQLContext => {
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      const user = authenticate(token);
      return { user };
    },
  });

  await apolloServer.start();
 
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

// 7. Start the Server
startApolloServer().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});