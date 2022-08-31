"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ImageSchema = new mongoose_1.default.Schema({
    image_url: { type: String },
    uploader: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    is_message: { type: Boolean, default: false },
    is_user_avatar: { type: Boolean, default: false },
    room_id: { type: mongoose_1.default.Schema.Types.ObjectId },
    is_room_avatar: { type: Boolean, default: false },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
ImageSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose_1.default.model("Image", ImageSchema);
