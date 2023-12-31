"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const errors_1 = require("../utility/errors");
const dto_1 = require("../models/dto/");
const password_1 = require("../utility/password");
const date_helpers_1 = require("../utility/date-helpers");
const UserRepository_1 = require("../repository/UserRepository");
const response_1 = require("../utility/response");
const notification_1 = require("../utility/notification");
let UserService = exports.UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    responseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.ErrorResponse)(404, 'requested method is not supported');
        });
    }
    /*              --- User Auth ---               */
    signUp(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(dto_1.SignUpInput, event.body);
                const error = yield (0, errors_1.inputValidation)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                const salt = yield (0, password_1.getSalt)();
                const hashedPassword = yield (0, password_1.hashPassword)(input.password, salt);
                const data = yield this.repository.createUser({
                    email: input.email,
                    password: hashedPassword,
                    phoneNumber: input.phoneNumber,
                    userType: 'BUYER',
                    salt,
                });
                return (0, response_1.SuccessResponse)(data);
            }
            catch (err) {
                console.log(err);
                return (0, response_1.ErrorResponse)(500, err);
            }
        });
    }
    signIn(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(dto_1.SignInInput, event.body);
                const error = yield (0, errors_1.inputValidation)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                const data = yield this.repository.findUser(input.email);
                const isValid = yield (0, password_1.validatePassword)(input.password, data.password);
                if (!isValid)
                    throw new Error('wrong data');
                const token = yield (0, password_1.generateToken)(data);
                return (0, response_1.SuccessResponse)({ token });
            }
            catch (err) {
                console.log(err);
                return (0, response_1.ErrorResponse)(500, err);
            }
        });
    }
    getVerificationToken(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (!payload)
                return (0, response_1.ErrorResponse)(403, 'authorization failed');
            const { code, expiry } = (0, notification_1.generateAccessCode)();
            yield this.repository.setVerificationCode(payload.id, code, expiry);
            // const res = await sendVerificationCode(code, payload.phoneNumber)
            return (0, response_1.SuccessResponse)({
                message: 'verification code is sent to your phone number by sms',
            });
        });
    }
    verifyUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (!payload)
                return (0, response_1.ErrorResponse)(403, 'authorization failed');
            const input = (0, class_transformer_1.plainToClass)(dto_1.VerificationCodeInput, event.body);
            const error = yield (0, errors_1.inputValidation)(input);
            if (error)
                return (0, response_1.ErrorResponse)(404, error);
            const { verification_code, expiry } = yield this.repository.findUser(payload.email);
            if (verification_code === +input.code) {
                const currentTime = new Date();
                const timeDifferance = (0, date_helpers_1.datetimeComparsion)(expiry, currentTime.toISOString(), 'm');
                if (timeDifferance < 0)
                    return (0, response_1.ErrorResponse)(403, 'verification code is expired');
                this.repository.verifyUser(payload.id);
                console.log('verified successfully');
            }
            return (0, response_1.SuccessResponse)({ message: 'user verified' });
        });
    }
    /*              --- User Profile ---               */
    getProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (!payload)
                return (0, response_1.ErrorResponse)(403, 'authorization failed');
            const result = yield this.repository.getUserProfile(payload.id);
            return (0, response_1.SuccessResponse)(result);
        });
    }
    createProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (!payload)
                return (0, response_1.ErrorResponse)(403, 'authorization failed');
            const input = (0, class_transformer_1.plainToClass)(dto_1.UserProfileInput, event.body);
            const error = yield (0, errors_1.inputValidation)(input);
            if (error)
                return (0, response_1.ErrorResponse)(404, error);
            const result = yield this.repository.fillOutProfile(payload.id, input);
            return (0, response_1.SuccessResponse)(result);
        });
    }
    updateProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from editProfile' });
        });
    }
    /*              --- User Cart ---               */
    getCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from getCart' });
        });
    }
    createCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from createCart' });
        });
    }
    updateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from updateCart' });
        });
    }
    /*              --- User Payments ---               */
    addPaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from addPaymentMethod' });
        });
    }
    getPaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from getPaymentMethod' });
        });
    }
    updatePaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: 'response from updatePaymentMethod' });
        });
    }
};
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository])
], UserService);
//# sourceMappingURL=UserService.js.map