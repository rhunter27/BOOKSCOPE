import express from 'express';
import { ApolloServer } from '@apollo/server';
// Removed unused import of expressMiddleware
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schemas/typeDefs.js'; // Import your GraphQL type definitions
import resolvers from './schemas/resolvers'; // Import your GraphQL resolvers
import authMiddleware from '../client/src/utils/auth.js'; // Import your authentication middleware

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

  // Use the imported authMiddleware instead of redefining it
  

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