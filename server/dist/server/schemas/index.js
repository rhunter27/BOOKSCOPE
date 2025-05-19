"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = exports.schema = void 0;
const schema_1 = require("@graphql-tools/schema");
const typeDefs_1 = __importDefault(require("./typeDefs"));
exports.typeDefs = typeDefs_1.default;
const resolvers_1 = __importDefault(require("./resolvers"));
exports.resolvers = resolvers_1.default;
exports.schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
});
//# sourceMappingURL=index.js.map