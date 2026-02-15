"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../src/app"));
async function handler(req, res) {
    // Set timeout headers for Vercel
    res.setHeader('Connection', 'close');
    return new Promise((resolve) => {
        const result = (0, app_1.default)(req, res);
        if (result instanceof Promise) {
            result.then(() => resolve(null)).catch(() => resolve(null));
        }
        else {
            res.on('finish', () => resolve(null));
        }
    });
}
