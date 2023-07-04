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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationCode = exports.generateAccessCode = void 0;
const twilio_1 = require("twilio");
const accountSid = process.env.TWILIO_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const phoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
const client = new twilio_1.Twilio(accountSid, authToken);
const generateAccessCode = () => {
    const code = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { code, expiry };
};
exports.generateAccessCode = generateAccessCode;
const sendVerificationCode = (code, recipientPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield client.messages.create({
        body: `Your verification code is ${code}`,
        from: phoneNumber,
        to: `+${recipientPhoneNumber}`.trim(),
    });
    console.log(res);
    return res;
});
exports.sendVerificationCode = sendVerificationCode;
//# sourceMappingURL=notification.js.map