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
exports.UserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const DbConnector_1 = require("./DbConnector");
let UserRepository = exports.UserRepository = class UserRepository {
    constructor(dbConnector) {
        this.dbConnector = dbConnector;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, salt, phoneNumber, userType } = user;
            const query = 'INSERT INTO "user"(email, password, salt, phone_number, user_type) VALUES($1,$2,$3,$4,$5) RETURNING *';
            const values = [email, password, salt, phoneNumber, userType];
            const result = yield this.dbConnector.executeQuery(query, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id, email, phone_number, user_type, password, verification_code, expiry FROM "user" WHERE email = $1';
            const values = [email];
            const result = yield this.dbConnector.executeQuery(query, values);
            if (result.rowCount < 1) {
                throw new Error('wrong data');
            }
            return result.rows[0];
        });
    }
    setVerificationCode(userId, code, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE "user" SET verification_code=$1, expiry=$2 WHERE id = $3 AND verified=false RETURNING *';
            const values = [code, expiry, userId];
            const result = yield this.dbConnector.executeQuery(query, values);
            if (result.rowCount < 1) {
                throw new Error('wrong data');
            }
            return result.rows[0];
        });
    }
    verifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE "user" SET verified=true, verification_code=null, expiry=null WHERE id = $1 AND verified=false RETURNING *';
            const values = [userId];
            const result = yield this.dbConnector.executeQuery(query, values);
            if (result.rowCount < 1) {
                throw new Error('user already verified');
            }
            return result.rows[0];
        });
    }
    fillOutProfile(userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, userType, address } = payload;
            yield this.updateProfile(userId, firstName, lastName, userType);
            const query = 'INSERT INTO "user_address"(user_id, address_line1, address_line2, city, post_code, country) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
            const values = [
                userId,
                address.addressLine1,
                address.addressLine2,
                address.city,
                address.postCode,
                address.country,
            ];
            const result = yield this.dbConnector.executeQuery(query, values);
            if (result.rowCount < 1) {
                throw new Error('wrong data');
            }
            return result.rows[0];
        });
    }
    updateProfile(userId, firstName, lastName, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE "user" SET first_name=$1, last_name=$2, user_type=$3 WHERE id = $4 RETURNING *';
            const values = [firstName, lastName, userType, userId];
            const result = yield this.dbConnector.executeQuery(query, values);
            if (result.rowCount < 1) {
                throw new Error('wrong data');
            }
            return result.rows[0];
        });
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileQuery = 'SELECT first_name, last_name, email, phone_number, user_type, verified FROM "user" WHERE id = $1';
            const profileValues = [userId];
            const profileResult = yield this.dbConnector.executeQuery(profileQuery, profileValues);
            if (profileResult.rowCount < 1) {
                throw new Error('user profile does not exist');
            }
            const profile = profileResult.rows[0];
            const addressQuery = 'SELECT id, address_line1, address_line2, city, post_code, country FROM "user_address" WHERE user_id = $1';
            const addressValues = [userId];
            const addresses = yield this.dbConnector.executeQuery(addressQuery, addressValues);
            if (addresses.rowCount > 0) {
                profile.addresses = addresses.rows;
            }
            return profile;
        });
    }
};
exports.UserRepository = UserRepository = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [DbConnector_1.DbConnector])
], UserRepository);
//# sourceMappingURL=UserRepository.js.map