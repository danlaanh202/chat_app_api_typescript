import { Schema } from "mongoose";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
interface InstitutionData {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  message: String;
  created_at: Date;
}
const MessageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: { createdAt: "created_at" } }
);
MessageSchema.plugin(paginate);
interface InstitutionDocument extends mongoose.Document, InstitutionData {}
export default mongoose.model<
  InstitutionDocument,
  mongoose.PaginateModel<InstitutionDocument>
>("Message", MessageSchema);
