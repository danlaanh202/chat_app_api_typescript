import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
interface InstitutionImage {
  image_url: String;
  uploader: mongoose.Types.ObjectId;
  is_message?: Boolean;
  is_user_avatar?: Boolean;
  room_id?: mongoose.Types.ObjectId;
  is_room_avatar?: Boolean;
  created_at?: Date;
}
const ImageSchema = new mongoose.Schema(
  {
    image_url: { type: String },
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true },
    is_message: { type: Boolean, default: false },
    is_user_avatar: { type: Boolean, default: false },
    room_id: { type: mongoose.Schema.Types.ObjectId },
    is_room_avatar: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
ImageSchema.plugin(paginate);
interface InstitutionDocument extends mongoose.Document, InstitutionImage {}
export default mongoose.model<
  InstitutionDocument,
  mongoose.PaginateModel<InstitutionDocument>
>("Image", ImageSchema);
