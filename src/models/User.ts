import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
export default mongoose.model("User", UserSchema);
