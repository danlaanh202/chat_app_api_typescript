"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MessageController_1 = __importDefault(require("../controllers/MessageController"));
const router = express_1.default.Router();
// router.get("/get_messages_from_room", MessageController.getAllMessagesFromRoom);
router.get("/get_messages_with_limit", MessageController_1.default.getMessageWithPaginate);
router.post("/send_messages_with_image", MessageController_1.default.sendMessageWithImage);
exports.default = router;
