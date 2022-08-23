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
const mongooseUtils_1 = require("../../utils/mongooseUtils");
const Message_1 = __importDefault(require("../models/Message"));
const Room_1 = __importDefault(require("../models/Room"));
class RoomController {
    createRoom(req, res, next) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const newRoom = new Room_1.default({
                users: (0, mongooseUtils_1.stringArraytoMongoId)((_a = req.body) === null || _a === void 0 ? void 0 : _a.users),
                isPrivate: (_b = req.body) === null || _b === void 0 ? void 0 : _b.isPrivate,
                room_name: (_c = req.body) === null || _c === void 0 ? void 0 : _c.room_name,
                room_host: (0, mongooseUtils_1.stringToMongoId)((_d = req.body) === null || _d === void 0 ? void 0 : _d.room_host),
            });
            try {
                const savedNewRoom = yield newRoom.save();
                return res.status(200).json(savedNewRoom);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    getRoomById(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const room = yield Room_1.default.findById(id);
                return res.status(200).json(room);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    getMyRooms(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield Room_1.default.find({
                    users: { $all: (0, mongooseUtils_1.stringToMongoId)((_a = req.query) === null || _a === void 0 ? void 0 : _a._id) },
                }).sort({ _id: -1 });
                return res.status(200).json(rooms);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    addToRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdsArray = (0, mongooseUtils_1.stringArraytoMongoId)(req.body.userIds);
            try {
                const addToRoom = yield Room_1.default.findByIdAndUpdate(req.body.roomId, {
                    $push: { users: { $each: userIdsArray } },
                });
                return res.status(200).json(addToRoom);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        });
    }
    deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                yield Message_1.default.deleteMany({ room: (0, mongooseUtils_1.stringToMongoId)(id) });
                let deletedItem = yield Room_1.default.findByIdAndDelete(id);
                return res.status(204).json(deletedItem);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.default = new RoomController();
