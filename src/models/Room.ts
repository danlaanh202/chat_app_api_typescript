import paginate from "mongoose-paginate-v2";
import { Schema, model, Document, Types, PaginateModel } from "mongoose";
export interface InstitutionRoom {
  users: Types.ObjectId[];
  isPrivate: Boolean;
  room_name: String;
  room_host: String;
  created_at: Date;
  updated_at: Date;
}
const RoomSchema = new Schema(
  {
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    isPrivate: {
      type: Boolean,
    },
    room_name: {
      type: String,
      required: true,
    },
    room_host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
RoomSchema.plugin(paginate);
interface InstitutionDocument extends Document, InstitutionRoom {}
export default model<InstitutionDocument, PaginateModel<InstitutionDocument>>(
  "Room",
  RoomSchema
);
