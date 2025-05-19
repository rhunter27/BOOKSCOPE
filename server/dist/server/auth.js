"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const graphql_1 = require("graphql");
const signToken = (user) => {
    const payload = { _id: user._id, email: user.email, username: user.username };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h', // Token expiration time
    });
};
exports.signToken = signToken;
const authMiddleware = ({ req }) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return req; // No token, proceed without attaching user info
    }
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        return req; // Invalid token format, proceed without attaching user info
    }
    try {
        // Verify the token and attach the user info to the request
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
    }
    catch (err) {
        console.error('Invalid or expired token:', err);
    }
    return req; // Return the modified request object
};
exports.authMiddleware = authMiddleware;
const Auth = (context) => {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
        throw new graphql_1.GraphQLError('Authorization header must be provided', {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    }
    catch (err) {
        throw new graphql_1.GraphQLError('Invalid/Expired token', {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        });
    }
};
exports.default = Auth;
//# sourceMappingURL=auth.js.map