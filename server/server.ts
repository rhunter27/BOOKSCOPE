import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schemas/typeDefs.js'; // Import your GraphQL type definitions
import resolvers from './schemas/resolvers'; // Import your GraphQL resolvers
import authMiddleware from '../client/src/utils/auth.js'; // Import your authentication middleware
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token verification

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName';

const startServer = async () => {
  // Initialize Express app
  const app = express();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();

  const authMiddleware = ({ req }: { req: any }) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return null; // No token, return null
    }
  
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return null; // Invalid token format
    }
  
    try {
      // Verify the token and return the decoded user
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
      return decodedToken; // Attach this to the context
    } catch (err) {
      console.error('Invalid or expired token:', err);
      return null; // Return null if token is invalid
    }
  };
  

  // Connect to MongoDB
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
};

startServer().catch((err) => {
  console.error('Error starting the server:', err);
});


export default authMiddleware;