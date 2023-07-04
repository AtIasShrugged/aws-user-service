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
exports.UserRepository = void 0;
const db_client_1 = require("../utility/db-client");
class UserRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = (0, db_client_1.DbClient)();
            yield client.connect();
            const { email, password, salt, phone, userType } = user;
            const query = 'INSERT INTO "user"(email,password,salt,phone,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *;';
            const values = [email, password, salt, phone, userType];
            const result = yield client.query(query, values);
            yield client.end();
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = (0, db_client_1.DbClient)();
            yield client.connect();
            const query = 'SELECT id, email, phone, user_type, password FROM "user" WHERE email = $1';
            const values = [email];
            const result = yield client.query(query, values);
            yield client.end();
            if (result.rowCount < 1) {
                throw new Error('wrong data');
            }
            return result.rows[0];
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map