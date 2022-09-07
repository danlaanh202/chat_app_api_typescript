import express, { Express } from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";
import bodyParser from "body-parser";
import route from "./src/routes";
import * as socketio from "socket.io";
import * as http from "http";
import Message from "./src/models/Message";
import { stringArraytoMongoId, stringToMongoId } from "./utils/mongooseUtils";
import User from "./src/models/User";
import Room from "./src/models/Room";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IAssociativeArray, IExtendedSocket, IObject } from "./src/types";
import { Socket } from "socket.io";
const app: Express = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "*",
  },
});
dotenv.config();
const port = process.env.PORT;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err: any) => {
    console.log("SOMETHING HAPPENDED" + err);
  });

route(app);

let sockets: IExtendedSocket[] = [];

io.on("connection", (socket: IExtendedSocket) => {
  //khi connect đến server thì sẽ cho user đó active
  sockets.push(socket);
  let socketUserId: string;
  socket.on("active", ({ userId }: { userId: string }) => {
    //khi user login thì sẽ cho active bởi id

    socketUserId = userId;
    socket.userId = userId;

    const updateActive = async () => {
      // const activeMember =
      await User.findByIdAndUpdate(
        userId,
        {
          is_active: true,
        },
        { new: true }
      );
    };
    updateActive();

    socket.on(
      "createRoom",
      async ({
        users,
        isPrivate,
        room_name,
        room_host,
      }: {
        users: string[];
        isPrivate: boolean;
        room_name: string;
        room_host: string;
      }) => {
        const createdRoom = new Room({
          users: stringArraytoMongoId(users),
          isPrivate: isPrivate,
          room_name: room_name,
          room_host: stringToMongoId(room_host),
        });

        try {
          const savedRoom = await createdRoom.save();
          //when saved, noti to all users
          const endPointMessage = new Message({
            user: stringToMongoId(room_host),
            message: `${room_name} has been created`,
            room: savedRoom._id,
            isEndPoint: true,
          });
          const savedEndPoint = await endPointMessage.save();
          const savedAfterUpdateRoom = await Room.findByIdAndUpdate(
            savedRoom._id,
            {
              last_message: savedEndPoint._id,
            },
            { new: true }
          );
          users.forEach((item) => {
            for (let i = 0; i < sockets.length; i++) {
              if (sockets[i].userId === item) {
                sockets[i].join(savedRoom._id);
                break;
              }
            }
          });

          io.sockets
            .to(savedRoom._id)
            .emit("update_room_create", savedAfterUpdateRoom);
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on(
      "add_member_to_room",
      async ({ userIds, roomId }: { userIds: string[]; roomId: string }) => {
        const userIdsArray = stringArraytoMongoId(userIds);
        try {
          const addToRoom = await Room.findByIdAndUpdate(
            roomId,
            {
              $push: { users: { $each: userIdsArray } },
            },
            { new: true }
          );
          userIds.forEach((item) => {
            for (let i = 0; i < sockets.length; i++) {
              if (sockets[i].userId === item) {
                if (addToRoom) sockets[i].join(addToRoom._id);
                break;
              }
            }
          });
          if (addToRoom)
            io.sockets.to(addToRoom._id).emit("update_room_add", addToRoom);
        } catch (err) {
          console.log("error when add members");
        }
      }
    );
  });
  socket.on("joinRoom", ({ room }) => {
    //sau khi join room thì update lại db

    socket.join(room);
    // console.log(socket.id + "Joined " + room);
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
      // console.log(savedMsg);
      //update last message to room with id below
      await Room.findByIdAndUpdate(
        roomId,
        {
          last_message: savedMsg._id,
        },
        { new: true }
      );
      io.sockets.to(roomId).emit("receivemsg", savedMsg);
    } catch (err) {
      console.log(`something happened when saving message`);
    }
  });
  socket.on("sendImg", async ({ img, roomId, userId }) => {
    //when using to send image
    try {
      const newMessage = new Message({
        user: stringToMongoId(userId),
        room: stringToMongoId(roomId),
        image: stringToMongoId(img),
      });
      const savedMessage = await (await newMessage.save()).populate("image");
      io.sockets.to(roomId).emit("receivedImg", savedMessage);
    } catch (err) {
      console.log(`something gone wrong`);
    }
  });
  socket.on("disconnect", () => {
    sockets.splice(sockets.indexOf(socket), 1);

    const disconnectUser = async () => {
      await User.findByIdAndUpdate(
        socketUserId,
        {
          is_active: false,
        },
        { new: true }
      );
    };
    console.log(`${socket.userId} disconnected`);
    disconnectUser();
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
