import { Schema } from "mongoose";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
interface InstitutionData {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  message: String;
  created_at: Date;
  image: mongoose.Types.ObjectId;
}
const MessageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
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
