import mongoose from "mongoose"
import { IDsAsObjectIds } from "../../helpers/constants/helper.constant"
import { TeamDocument } from "../schemas/team.schema";

export const TEAM_ID_STR = "5e48197979a7570000000005";
export const TEAM_ID_2_STR = "5e48197979a7570000000006";

export const TEAM_ID = new mongoose.Types.ObjectId(TEAM_ID_STR);
export const TEAM_ID_2 = new mongoose.Types.ObjectId(TEAM_ID_2_STR);

export const TEAM_MODEL_MOCK = {
  create: jest.fn(),
  findById: () => ({
    exec: jest.fn().mockResolvedValue(TEAM),
  }),
  save: jest.fn(),
}

export const TEAM: TeamDocument = {
  _id: TEAM_ID,
  name: 'My Team',
  users: IDsAsObjectIds,
  ...TEAM_MODEL_MOCK,
} as unknown as TeamDocument;

export const TEAM_2: TeamDocument = {
  _id: TEAM_ID_2,
  name: 'My Team 2',
  users: [
    IDsAsObjectIds[1],
    IDsAsObjectIds[2],
  ],
  ...TEAM_MODEL_MOCK,
} as unknown as TeamDocument;