"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const room_1 = __importDefault(require("./room"));
const message_1 = __importDefault(require("./message"));
const user_1 = __importDefault(require("./user"));
function route(app) {
    app.use("/auth", auth_1.default);
    app.use("/room", room_1.default);
    app.use("/message", message_1.default);
    app.use("/user", user_1.default);
}
exports.default = route;
