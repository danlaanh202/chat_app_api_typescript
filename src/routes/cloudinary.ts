import express from "express";
import CloudinaryController from "../controllers/CloudinaryController";
const router = express.Router();

router.post("/post", CloudinaryController.postImage);
export default router;
