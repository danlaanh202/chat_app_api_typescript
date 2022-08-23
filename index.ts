import { IMessage } from "./src/types/index";
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import route from "./src/routes";
import * as socketio from "socket.io";
import * as http from "http";
import Message from "./src/models/Message";
import { stringToMongoId } from "./utils/mongooseUtils";

const app: Express = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
dotenv.config();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err: any) => {
    console.log("SOMETHING HAPPENDED" + err);
  });

route(app);

io.on("connection", (socket) => {
  //khi connect đến server thì sẽ cho user đó active
  socket.on("joinRoom", ({ room }) => {
    //sau khi join room thì update lại db

    socket.join(room);
    console.log(socket.id + "Joined " + room);
  });
  socket.on("sendmsg", async ({ msg, roomId, userId }) => {
    //gửi msg và lưu vào trong database
    const newMessage = new Message({
      user: stringToMongoId(userId),
      message: msg,
      room: stringToMongoId(roomId),
    });
    try {
      const savedMsg = await newMessage.save();
      //saved and emit to realtime socket

      io.sockets.to(roomId).emit("receivemsg", savedMsg);
    } catch (err) {
      console.log(`something happened when saving message`);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
