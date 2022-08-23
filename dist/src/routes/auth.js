"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
router.post("/register", AuthController_1.default.register);
router.post("/login", AuthController_1.default.login);
exports.default = router;
