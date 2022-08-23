"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const MessageSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Room",
    },
}, { timestamps: { createdAt: "created_at" } });
MessageSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose_2.default.model("Message", MessageSchema);
