import { Request, Response } from "express";
import { Document } from "mongoose";
import Room, { InstitutionRoom } from "../models/Room";

import User from "../models/User";

class UserController {
  async getUserByNameOutOfRoom(req: Request, res: Response) {
    const roomId = req.query.roomId;

    try {
      let users;
      if (roomId) {
        const userIdsOfRoom = await Room.findById(roomId);

        users = await User.find({
          username: { $regex: req.query.username, $options: "i" },
          _id: { $nin: (userIdsOfRoom as InstitutionRoom).users },
        });
      } else {
        users = await User.find({
          username: { $regex: req.query.username, $options: "i" },
        });
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getAllUserFromRoom(req: Request, res: Response) {
    const roomId = req.query.roomId;
    try {
      const userIdsOfRoom = await Room.findById(roomId);
      const users = await User.find({
        _id: { $in: (userIdsOfRoom as InstitutionRoom).users },
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
export default new UserController();
