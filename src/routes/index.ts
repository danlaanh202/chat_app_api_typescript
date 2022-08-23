import authRouter from "./auth";
import roomRouter from "./room";
import messageRouter from "./message";
import userRouter from "./user";
function route(app: any) {
  app.use("/auth", authRouter);
  app.use("/room", roomRouter);
  app.use("/message", messageRouter);
  app.use("/user", userRouter);
}
export default route;
