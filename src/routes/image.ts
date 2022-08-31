import express from "express";
import ImageController from "../controllers/ImageController";
const router = express.Router();

router.post("/up_img_msg", ImageController.postMessageImage);
router.get("/get_all_images_from_room", ImageController.getAllImagesFromRoom);
export default router;
