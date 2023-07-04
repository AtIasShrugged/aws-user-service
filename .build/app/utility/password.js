"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.validatePassword = exports.hashPassword = exports.getSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'secret';
const getSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.getSalt = getSalt;
const hashPassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.hashPassword = hashPassword;
const validatePassword = (inputPassword, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(inputPassword, savedPassword);
});
exports.validatePassword = validatePassword;
const generateToken = ({ id, email, phone, userType }) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign({
        id,
        email,
        phone,
        userType,
    }, secret, {
        expiresIn: '30d',
    });
});
exports.generateToken = generateToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (token !== '') {
            const payload = jsonwebtoken_1.default.verify(token.split(' ')[1], secret);
            return payload;
        }
    }
    catch (err) {
        console.log(err);
        return null;
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=password.js.map