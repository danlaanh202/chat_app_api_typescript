"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomController_1 = __importDefault(require("../controllers/RoomController"));
const router = express_1.default.Router();
router.get("/get/:id", RoomController_1.default.getRoomById);
router.delete("/delete/:id", RoomController_1.default.deleteRoom);
router.post("/create", RoomController_1.default.createRoom);
router.get("/get_my_room", RoomController_1.default.getMyRooms);
router.put("/add_users", RoomController_1.default.addToRoom);
exports.default = router;
