import express from "express";
import RoomController from "../controllers/RoomController";
const router = express.Router();

router.get("/get/:id", RoomController.getRoomById);
router.delete("/delete/:id", RoomController.deleteRoom);
router.post("/create", RoomController.createRoom);
router.get("/get_my_room", RoomController.getMyRooms);
router.put("/add_users", RoomController.addToRoom);
export default router;
