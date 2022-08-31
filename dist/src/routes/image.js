"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ImageController_1 = __importDefault(require("../controllers/ImageController"));
const router = express_1.default.Router();
router.post("/up_img_msg", ImageController_1.default.postMessageImage);
router.get("/get_all_images_from_room", ImageController_1.default.getAllImagesFromRoom);
exports.default = router;
