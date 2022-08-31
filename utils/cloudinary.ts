import * as cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: "dantranne",
  api_key: process.env.CLO_KEY,
  api_secret: process.env.CLO_SEC,
});

export default cloudinary;
