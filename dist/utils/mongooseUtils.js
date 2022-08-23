"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringArraytoMongoId = exports.stringToMongoId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stringToMongoId = (string) => {
    const objectId = new mongoose_1.default.Types.ObjectId(string);
    return objectId;
};
exports.stringToMongoId = stringToMongoId;
const stringArraytoMongoId = (strArray) => {
    let newArray = [];
    strArray.forEach((item, index) => {
        newArray.push(stringToMongoId(item));
    });
    return newArray;
};
exports.stringArraytoMongoId = stringArraytoMongoId;
