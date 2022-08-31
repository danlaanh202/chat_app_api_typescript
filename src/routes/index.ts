import authRouter from "./auth";
import roomRouter from "./room";
import messageRouter from "./message";
import userRouter from "./user";
import cloudinaryRouter from "./cloudinary";
import imageRouter from "./image";
function route(app: any) {
  app.use("/auth", authRouter);
  app.use("/room", roomRouter);
  app.use("/message", messageRouter);
  app.use("/user", userRouter);
  app.use("/cloudinary", cloudinaryRouter);
  app.use("/image", imageRouter);
}
export default route;
