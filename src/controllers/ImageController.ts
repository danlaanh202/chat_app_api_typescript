import { Request, Response } from "express";
import { stringToMongoId } from "../../utils/mongooseUtils";
import Image from "../models/Image";

class ImageController {
  async postMessageImage(req: Request, res: Response) {
    try {
      const newImage = new Image({
        image_url: req.body.url,
        is_message: true,
        room_id: stringToMongoId(req.body.room_id),
        uploader: stringToMongoId(req.body.uploader),
      });
      const savedImage = await newImage.save();
      return res.status(200).json(savedImage);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getAllImagesFromRoom(req: Request, res: Response) {
    try {
      const options = {
        sort: {
          _id: -1,
        },
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 9,
        //populate if we need some thing like open image to show modal
        lean: true,
      };
      const roomId = req.query.roomId;
      const images = await Image.paginate(
        {
          room_id: stringToMongoId(roomId as string),
        },
        options
      );
      return res.status(200).json(images);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
export default new ImageController();
