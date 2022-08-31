import { Request, Response } from "express";
import cloudinary from "../../utils/cloudinary";

class CloudinaryController {
  async postImage(req: Request, res: Response) {
    try {
      const image = req.body.file64;
      const uploadedResponse = await cloudinary.v2.uploader.upload(image, {
        upload_preset: "chat_app",
      });
      return res.status(200).json(uploadedResponse);
    } catch (error) {
      return res.status(500).json({ err: "Upload failed" });
    }
  }
}
export default new CloudinaryController();
