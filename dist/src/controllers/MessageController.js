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
class MessageController {
    createMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new Message_1.default({
                user: req.body.userId,
                message: req.body.message,
                room: req.body.roomId,
            });
            try {
                const savedMessage = yield newMessage.save();
                return res.status(200).json(savedMessage);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        });
    }
    // async getAllMessagesFromRoom(req: Request, res: Response) {
    //   try {
    //     const messages = await Message.find({
    //       room: stringToMongoId(req.query.roomId as string),
    //     });
    //     return res.status(200).json(messages);
    //   } catch (error) {
    //     return res.status(500).json(error);
    //   }
    // }
    sendMessageWithImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new Message_1.default({
                    user: (0, mongooseUtils_1.stringToMongoId)(req.body.user),
                    room: (0, mongooseUtils_1.stringToMongoId)(req.body.roomId),
                    image: (0, mongooseUtils_1.stringToMongoId)(req.body.imageId),
                });
                const savedMessage = yield newMessage.save();
                return res.status(200).json(savedMessage);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        });
    }
    getMessageWithPaginate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    sort: { _id: -1 },
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 20,
                    populate: "image user room",
                    lean: true,
                };
                let messages = yield Message_1.default.paginate({
                    room: (0, mongooseUtils_1.stringToMongoId)(req.query.roomId),
                }, options).then((result) => result);
                return res.status(200).json(messages);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.default = new MessageController();
