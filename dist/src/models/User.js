"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    is_active: {
        type: Boolean,
        default: false,
    },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
exports.default = mongoose_1.default.model("User", UserSchema);
