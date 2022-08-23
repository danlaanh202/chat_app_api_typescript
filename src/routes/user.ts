import express from "express";
import UserController from "../controllers/UserController";
const router = express.Router();

router.get(
  "/get_by_username_out_of_room",
  UserController.getUserByNameOutOfRoom
);
router.get("/get_from_room", UserController.getAllUserFromRoom);
export default router;
