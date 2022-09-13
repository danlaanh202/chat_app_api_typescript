"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./src/routes"));
const socketio = __importStar(require("socket.io"));
const http = __importStar(require("http"));
const Message_1 = __importDefault(require("./src/models/Message"));
const mongooseUtils_1 = require("./utils/mongooseUtils");
const User_1 = __importDefault(require("./src/models/User"));
const Room_1 = __importDefault(require("./src/models/Room"));
const app = (0, express_1.default)();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: "*",
    },
});
dotenv_1.default.config();
const port = process.env.PORT;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
}));
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => {
    console.log("DB CONNECTED");
})
    .catch((err) => {
    console.log("SOMETHING HAPPENDED" + err);
});
(0, routes_1.default)(app);
let sockets = [];
io.on("connection", (socket) => {
    //khi connect đến server thì sẽ cho user đó active
    sockets.push(socket);
    let socketUserId;
    socket.on("active", ({ userId }) => {
        //khi user login thì sẽ cho active bởi id
        socketUserId = userId;
        socket.userId = userId;
        const updateActive = () => __awaiter(void 0, void 0, void 0, function* () {
            // const activeMember =
            yield User_1.default.findByIdAndUpdate(userId, {
                is_active: true,
            }, { new: true });
        });
        updateActive();
        socket.on("createRoom", ({ users, isPrivate, room_name, room_host, }) => __awaiter(void 0, void 0, void 0, function* () {
            const createdRoom = new Room_1.default({
                users: (0, mongooseUtils_1.stringArraytoMongoId)(users),
                isPrivate: isPrivate,
                room_name: room_name,
                room_host: (0, mongooseUtils_1.stringToMongoId)(room_host),
            });
            try {
                const savedRoom = yield createdRoom.save();
                //when saved, noti to all users
                const endPointMessage = new Message_1.default({
                    user: (0, mongooseUtils_1.stringToMongoId)(room_host),
                    message: `${room_name} has been created`,
                    room: savedRoom._id,
                    isEndPoint: true,
                });
                const savedEndPoint = yield endPointMessage.save();
                const savedAfterUpdateRoom = yield Room_1.default.findByIdAndUpdate(savedRoom._id, {
                    last_message: savedEndPoint._id,
                }, { new: true }).populate({
                    path: "last_message",
                    populate: {
                        path: "user",
                    },
                });
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
            }
            catch (err) {
                console.log(err);
            }
        }));
        socket.on("add_member_to_room", ({ userIds, roomId }) => __awaiter(void 0, void 0, void 0, function* () {
            const userIdsArray = (0, mongooseUtils_1.stringArraytoMongoId)(userIds);
            try {
                const addToRoom = yield Room_1.default.findByIdAndUpdate(roomId, {
                    $push: { users: { $each: userIdsArray } },
                }, { new: true }).populate({
                    path: "last_message",
                    populate: {
                        path: "user",
                    },
                });
                userIds.forEach((item) => {
                    for (let i = 0; i < sockets.length; i++) {
                        if (sockets[i].userId === item) {
                            if (addToRoom)
                                sockets[i].join(addToRoom._id);
                            break;
                        }
                    }
                });
                if (addToRoom)
                    io.sockets.to(addToRoom._id).emit("update_room_add", addToRoom);
            }
            catch (err) {
                console.log("error when add members");
            }
        }));
    });
    socket.on("joinRoom", ({ room }) => {
        //sau khi join room thì update lại db
        socket.join(room);
        // console.log(socket.id + "Joined " + room);
    });
    socket.on("sendmsg", ({ msg, roomId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
        //gửi msg và lưu vào trong database
        const newMessage = new Message_1.default({
            user: (0, mongooseUtils_1.stringToMongoId)(userId),
            message: msg,
            room: (0, mongooseUtils_1.stringToMongoId)(roomId),
        });
        try {
            const savedMsg = yield (yield newMessage.save()).populate("user room");
            //saved and emit to realtime socket
            // console.log(savedMsg);
            //update last message to room with id below
            const updatedRoom = yield Room_1.default.findByIdAndUpdate(roomId, {
                last_message: savedMsg._id,
            }, { new: true }).populate({
                path: "last_message",
                populate: {
                    path: "user",
                },
            });
            //after
            io.sockets.to(roomId).emit("receivemsg", { savedMsg, updatedRoom });
        }
        catch (err) {
            console.log(`something happened when saving message`);
        }
    }));
    socket.on("sendImg", ({ img, roomId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
        //when using to send image
        try {
            const newMessage = new Message_1.default({
                user: (0, mongooseUtils_1.stringToMongoId)(userId),
                room: (0, mongooseUtils_1.stringToMongoId)(roomId),
                image: (0, mongooseUtils_1.stringToMongoId)(img),
            });
            const savedMessage = yield (yield newMessage.save()).populate("image user room");
            const updatedRoom = yield Room_1.default.findByIdAndUpdate(roomId, {
                last_message: savedMessage._id,
            }, { new: true }).populate({
                path: "last_message",
                populate: {
                    path: "user",
                },
            });
            io.sockets.to(roomId).emit("receivedImg", { savedMessage, updatedRoom });
        }
        catch (err) {
            console.log(`something gone wrong`);
        }
    }));
    socket.on("disconnect", () => {
        sockets.splice(sockets.indexOf(socket), 1);
        const disconnectUser = () => __awaiter(void 0, void 0, void 0, function* () {
            yield User_1.default.findByIdAndUpdate(socketUserId, {
                is_active: false,
            }, { new: true });
        });
        console.log(`${socket.userId} disconnected`);
        disconnectUser();
    });
});
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
