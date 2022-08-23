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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("../models/Room"));
const User_1 = __importDefault(require("../models/User"));
class UserController {
    getUserByNameOutOfRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = req.query.roomId;
            try {
                let users;
                if (roomId) {
                    const userIdsOfRoom = yield Room_1.default.findById(roomId);
                    users = yield User_1.default.find({
                        username: { $regex: req.query.username, $options: "i" },
                        _id: { $nin: userIdsOfRoom.users },
                    });
                }
                else {
                    users = yield User_1.default.find({
                        username: { $regex: req.query.username, $options: "i" },
                    });
                }
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    getAllUserFromRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = req.query.roomId;
            try {
                const userIdsOfRoom = yield Room_1.default.findById(roomId);
                const users = yield User_1.default.find({
                    _id: { $in: userIdsOfRoom.users },
                });
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.default = new UserController();
