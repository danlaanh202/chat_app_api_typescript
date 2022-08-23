import paginate from "mongoose-paginate-v2";
import { NextFunction, Request, Response } from "express";
import {
  stringArraytoMongoId,
  stringToMongoId,
} from "../../utils/mongooseUtils";

import Message from "../models/Message";

class MessageController {
  async createMessage(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<any> {
    const newMessage = new Message({
      user: req.body.userId,
      message: req.body.message,
      room: req.body.roomId,
    });
    try {
      const savedMessage = await newMessage.save();
      return res.status(200).json(savedMessage);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // async getAllMessagesFromRoom(req: Request, res: Response) {
  //   try {
  //     const messages = await Message.find({
  //       room: stringToMongoId(req.query.roomId as string),
  //     });
  //     return res.status(200).json(messages);
  //   } catch (error) {
  //     return res.status(500).json(error);
  //   }
  // }
  async getMessageWithPaginate(req: Request, res: Response) {
    try {
      let messages = await Message.paginate(
        {
          room: stringToMongoId(req.query.roomId as string),
        },
        {
          sort: { _id: -1 },
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 20,
        }
      );
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
export default new MessageController();
