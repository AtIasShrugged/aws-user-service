"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbClient = void 0;
const pg_1 = require("pg");
const DbClient = () => {
    return new pg_1.Client({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        user: process.env.DATABASE_USER || 'root',
        database: process.env.DATABASE_NAME || 'aws_user_service',
        password: process.env.DATABASE_PASS || 'root',
        port: +process.env.DATABASE_PORT || 5432,
    });
};
exports.DbClient = DbClient;
//# sourceMappingURL=db-client.js.map