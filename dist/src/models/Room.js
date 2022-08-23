"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    users: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    },
    isPrivate: {
        type: Boolean,
    },
    room_name: {
        type: String,
        required: true,
    },
    room_host: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
RoomSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("Room", RoomSchema);
