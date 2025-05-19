"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Book subdocument schema
const BookSchema = new mongoose_1.Schema({
    bookId: {
        type: String,
        required: true,
    },
    authors: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    link: {
        type: String,
    },
});
// Main user schema
const LocalUserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    savedBooks: [BookSchema],
});
// Hash password before saving
LocalUserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt_1.default.hash(this.password, saltRounds);
    }
    next();
});
// Method to compare and validate password
LocalUserSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt_1.default.compare(password, this.password);
};
// Create and export the model
const User = (0, mongoose_1.model)('User', LocalUserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map