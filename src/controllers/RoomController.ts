import { NextFunction, Request, Response } from "express";
import {
  stringArraytoMongoId,
  stringToMongoId,
} from "../../utils/mongooseUtils";
import Message from "../models/Message";

import Room from "../models/Room";

class RoomController {
  async createRoom(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<any> {
    const newRoom = new Room({
      users: stringArraytoMongoId(req.body?.users),
      isPrivate: req.body?.isPrivate,
      room_name: req.body?.room_name,
      room_host: stringToMongoId(req.body?.room_host),
    });
    try {
      const savedNewRoom = await newRoom.save();
      return res.status(200).json(savedNewRoom);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getRoomById(req: Request, res: Response) {
    const id = req.params?.id as string;
    try {
      const room = await Room.findById(id);
      return res.status(200).json(room);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getMyRooms(req: Request, res: Response) {
    const searchText = req.query.search_text;
    try {
      const rooms = await Room.find({
        users: { $all: stringToMongoId(req.query?._id as string) },
        room_name: { $regex: searchText, $options: "i" },
      }).sort({ _id: -1 });
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async addToRoom(req: Request, res: Response) {
    const userIdsArray = stringArraytoMongoId(req.body.userIds);
    try {
      const addToRoom = await Room.findByIdAndUpdate(req.body.roomId, {
        $push: { users: { $each: userIdsArray } },
      });

      return res.status(200).json(addToRoom);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async deleteRoom(req: Request, res: Response) {
    const id = req.params.id;
    try {
      await Message.deleteMany({ room: stringToMongoId(id) });
      let deletedItem = await Room.findByIdAndDelete(id);
      return res.status(204).json(deletedItem);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
export default new RoomController();
