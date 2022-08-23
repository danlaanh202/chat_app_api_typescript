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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./src/routes"));
const socketio = __importStar(require("socket.io"));
const http = __importStar(require("http"));
const Message_1 = __importDefault(require("./src/models/Message"));
const mongooseUtils_1 = require("./utils/mongooseUtils");
const app = (0, express_1.default)();
const server = http.createServer(app);
const io = new socketio.Server(server);
dotenv_1.default.config();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => {
    console.log("DB CONNECTED");
})
    .catch((err) => {
    console.log("SOMETHING HAPPENDED" + err);
});
(0, routes_1.default)(app);
io.on("connection", (socket) => {
    //khi connect đến server thì sẽ cho user đó active
    socket.on("joinRoom", ({ room }) => {
        //sau khi join room thì update lại db
        socket.join(room);
        console.log(socket.id + "Joined " + room);
    });
    socket.on("sendmsg", ({ msg, roomId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
        //gửi msg và lưu vào trong database
        const newMessage = new Message_1.default({
            user: (0, mongooseUtils_1.stringToMongoId)(userId),
            message: msg,
            room: (0, mongooseUtils_1.stringToMongoId)(roomId),
        });
        try {
            const savedMsg = yield newMessage.save();
            //saved and emit to realtime socket
            io.sockets.to(roomId).emit("receivemsg", savedMsg);
        }
        catch (err) {
            console.log(`something happened when saving message`);
        }
    }));
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});