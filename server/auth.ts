import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

export const signToken = (user: { _id: string; email: string; username: string }) => {
  const payload = { _id: user._id, email: user.email, username: user.username };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '2h', // Token expiration time
  });
};

export const authMiddleware = ({ req }: { req: any }) => {
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
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decodedToken;
  } catch (err) {
    console.error('Invalid or expired token:', err);
  }

  return req; // Return the modified request object
};

const Auth = (context: any) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new GraphQLError('Authorization header must be provided', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken;
  } catch (err) {
    throw new GraphQLError('Invalid/Expired token', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
};

export default Auth;