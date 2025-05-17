import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

export const signToken = (user: { _id: string; email: string; username: string }) => {
  const payload = { _id: user._id, email: user.email, username: user.username };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '2h', // Token expiration time
  });
};

class Auth {
    // Retrieve the token from localStorage
    static getToken(): string | null {
      return localStorage.getItem('id_token');
    }
  
    // Save the token to localStorage
    static login(token: string): void {
      localStorage.setItem('id_token', token);
      window.location.assign('/');
    }
  
    // Remove the token from localStorage and log the user out
    static logout(): void {
      localStorage.removeItem('id_token');
      window.location.assign('/');
    }

    // Decode the token to get the user's profile
  static getProfile(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
  
    // Check if the user is logged in by verifying the token
    static loggedIn(): boolean {
      const token = this.getToken();
      return !!token && !this.isTokenExpired(token);
    }
  
    // Decode the token to check its expiration
    static isTokenExpired(token: string): boolean {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp < Date.now() / 1000;
      } catch (err) {
        return false;
      }
    }
  }
  
  export default Auth;