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
const Image_1 = __importDefault(require("../models/Image"));
class ImageController {
    postMessageImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newImage = new Image_1.default({
                    image_url: req.body.url,
                    is_message: true,
                    room_id: (0, mongooseUtils_1.stringToMongoId)(req.body.room_id),
                    uploader: (0, mongooseUtils_1.stringToMongoId)(req.body.uploader),
                });
                const savedImage = yield newImage.save();
                return res.status(200).json(savedImage);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    getAllImagesFromRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    sort: {
                        _id: -1,
                    },
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 9,
                    //populate if we need some thing like open image to show modal
                    lean: true,
                };
                const roomId = req.query.roomId;
                const images = yield Image_1.default.paginate({
                    room_id: (0, mongooseUtils_1.stringToMongoId)(roomId),
                }, options);
                return res.status(200).json(images);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.default = new ImageController();
