"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
router.get("/get_by_username_out_of_room", UserController_1.default.getUserByNameOutOfRoom);
router.get("/get_from_room", UserController_1.default.getAllUserFromRoom);
exports.default = router;
