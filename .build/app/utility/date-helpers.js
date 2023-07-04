"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.datetimeComparsion = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const datetimeComparsion = (fromDate, toDate, type) => {
    const startDate = (0, dayjs_1.default)(fromDate);
    return startDate.diff((0, dayjs_1.default)(toDate), type, true);
};
exports.datetimeComparsion = datetimeComparsion;
//# sourceMappingURL=date-helpers.js.map