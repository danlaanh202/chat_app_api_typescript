import { NextFunction, Request, Response } from "express";

import User from "../models/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const newUser = new User({
      username: req.body?.username.trim().toLowerCase(),
      password: CryptoJS.AES.encrypt(
        req.body?.password,
        process.env.PASS_SEC as string
      ).toString(),
    });
    try {
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(404).json("No user Found");

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC as string
      );
      const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      if (OriginalPassword !== req.body.password)
        return res.status(401).json("Wrong password");

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC as string
      );

      const { password, ...others } = (user as any)._doc;

      return res.status(200).json({ ...others, accessToken });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new AuthController();
