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
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
class CloudinaryController {
    postImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = req.body.file64;
                const uploadedResponse = yield cloudinary_1.default.v2.uploader.upload(image, {
                    upload_preset: "chat_app",
                });
                return res.status(200).json(uploadedResponse);
            }
            catch (error) {
                return res.status(500).json({ err: "Upload failed" });
            }
        });
    }
}
exports.default = new CloudinaryController();
