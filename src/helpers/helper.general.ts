import mongoose from "mongoose";

export class HelperGeneral {
  toMongoID(id: string) {
    return new mongoose.Types.ObjectId(id);
  }

  arrayIdsToMongoIds(ids: string[]): mongoose.Types.ObjectId[] {
    return ids.map(id => new mongoose.Types.ObjectId(id));
  }
}