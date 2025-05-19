"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = require("jwt-decode");
const signToken = (user) => {
    const payload = { _id: user._id, email: user.email, username: user.username };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h', // Token expiration time
    });
};
exports.signToken = signToken;
class Auth {
    // Retrieve the token from localStorage
    static getToken() {
        return localStorage.getItem('id_token');
    }
    // Save the token to localStorage
    static login(token) {
        localStorage.setItem('id_token', token);
        window.location.assign('/');
    }
    // Remove the token from localStorage and log the user out
    static logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
    // Decode the token to get the user's profile
    static getProfile() {
        const token = this.getToken();
        if (token) {
            return (0, jwt_decode_1.jwtDecode)(token);
        }
        return null;
    }
    // Check if the user is logged in by verifying the token
    static loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }
    // Decode the token to check its expiration
    static isTokenExpired(token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.exp < Date.now() / 1000;
        }
        catch (err) {
            return false;
        }
    }
}
exports.default = Auth;
//# sourceMappingURL=auth.js.map