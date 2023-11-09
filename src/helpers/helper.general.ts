import mongoose from "mongoose";

export class HelperGeneral {
  toMongoID(id: string) {
    return new mongoose.Types.ObjectId(id);
  }
}