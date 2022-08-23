import mongoose, { Mongoose } from "mongoose";

const stringToMongoId = (string: string) => {
  const objectId = new mongoose.Types.ObjectId(string);
  return objectId;
};
const stringArraytoMongoId = (strArray: string[]) => {
  let newArray: Array<mongoose.Types.ObjectId> = [];
  strArray.forEach((item, index) => {
    newArray.push(stringToMongoId(item));
  });
  return newArray;
};
export { stringToMongoId, stringArraytoMongoId };
