"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const typeDefs_js_1 = __importDefault(require("./schemas/typeDefs.js")); // Import your GraphQL type definitions
const resolvers_1 = __importDefault(require("./schemas/resolvers")); // Import your GraphQL resolvers
const auth_js_1 = __importDefault(require("../client/src/utils/auth.js")); // Import your authentication middleware
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import jsonwebtoken for token verification
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName';
const startServer = async () => {
    // Initialize Express app
    const app = (0, express_1.default)();
    // Create Apollo Server
    const server = new server_1.ApolloServer({
        typeDefs: typeDefs_js_1.default,
        resolvers: resolvers_1.default,
    });
    // Start Apollo Server
    await server.start();
    const authMiddleware = ({ req }) => {
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
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return decodedToken; // Attach this to the context
        }
        catch (err) {
            console.error('Invalid or expired token:', err);
            return null; // Return null if token is invalid
        }
    };
    // Connect to MongoDB
    mongoose_1.default
        .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
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
exports.default = auth_js_1.default;
//# sourceMappingURL=server.js.map