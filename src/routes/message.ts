import express from "express";
import MessageController from "../controllers/MessageController";
const router = express.Router();

// router.get("/get_messages_from_room", MessageController.getAllMessagesFromRoom);
router.get(
  "/get_messages_with_limit",
  MessageController.getMessageWithPaginate
);
export default router;
