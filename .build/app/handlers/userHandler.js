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
exports.payment = exports.cart = exports.profile = exports.verify = exports.signIn = exports.signUp = void 0;
const UserService_1 = require("../services/UserService");
const response_1 = require("../utility/response");
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const tsyringe_1 = require("tsyringe");
const service = tsyringe_1.container.resolve(UserService_1.UserService);
exports.signUp = (0, core_1.default)((event) => {
    return service.signUp(event);
}).use((0, http_json_body_parser_1.default)());
exports.signIn = (0, core_1.default)((event) => {
    return service.signIn(event);
}).use((0, http_json_body_parser_1.default)());
exports.verify = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    switch (httpMethod) {
        case 'get':
            return service.getVerificationToken(event);
        case 'post':
            return service.verifyUser(event);
        default:
            return service.responseWithError(event);
    }
}).use((0, http_json_body_parser_1.default)());
const profile = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    switch (httpMethod) {
        case 'get':
            return service.getProfile(event);
        case 'post':
            return service.createProfile(event);
        case 'put':
            return service.updateProfile(event);
        default:
            return (0, response_1.ErrorResponse)(404, 'requested method is not supported!');
    }
});
exports.profile = profile;
const cart = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    switch (httpMethod) {
        case 'get':
            return service.getCart(event);
        case 'post':
            return service.createCart(event);
        case 'put':
            return service.updateCart(event);
        default:
            return (0, response_1.ErrorResponse)(404, 'requested method is not supported!');
    }
});
exports.cart = cart;
const payment = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    switch (httpMethod) {
        case 'get':
            return service.getPaymentMethod(event);
        case 'post':
            return service.addPaymentMethod(event);
        case 'put':
            return service.updatePaymentMethod(event);
        default:
            return (0, response_1.ErrorResponse)(404, 'requested method is not supported!');
    }
});
exports.payment = payment;
//# sourceMappingURL=UserHandler.js.map