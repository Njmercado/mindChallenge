import mongoose from 'mongoose';
import { HelperGeneral } from './helper.general';
import { IDs } from './constants/helper.constant';

describe('HelperGeneral', () => {
  let helperGeneral: HelperGeneral;

  beforeEach(() => {
    helperGeneral = new HelperGeneral();
  });

  it('should convert a string ID to a MongoDB ObjectId', () => {
    const mongoId = helperGeneral.toMongoID(IDs[0]);

    expect(mongoId instanceof mongoose.Types.ObjectId).toBeTruthy();
    expect(mongoId.toString()).toEqual(IDs[0]);
  });

  it('should convert an array of string IDs to an array of MongoDB ObjectIds', () => {
    const mongoIds = helperGeneral.arrayIdsToMongoIds(IDs);

    expect(mongoIds.length).toBe(IDs.length);
    mongoIds.forEach(mongoId => expect(mongoId instanceof mongoose.Types.ObjectId).toBeTruthy());
    expect(mongoIds[0].toString()).toEqual(IDs[0]);
    expect(mongoIds[1].toString()).toEqual(IDs[1]);
    expect(mongoIds[2].toString()).toEqual(IDs[2]);
  });
});