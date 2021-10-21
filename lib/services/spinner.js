"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = void 0;
var ora_1 = __importDefault(require("ora"));
exports.spinner = (0, ora_1.default)({ color: 'cyan' });
