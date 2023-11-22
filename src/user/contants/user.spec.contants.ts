import { User } from "../schemas/user.schema";

export const USER_MODEL_MOCK = {
  create: jest.fn(),
  save: jest.fn(),
  findById: () => ({
    exec: jest.fn().mockResolvedValue(USER_DATA),
  }),
}

export const USER_MODEL_WITH_NO_ASSIGNED_TEAM_MOCK = {
  create: jest.fn(),
  save: jest.fn(),
  findById: () => ({
    exec: jest.fn().mockResolvedValue(USER_DATA_WITH_NO_ASSIGNED_TEAM),
  }),
}

export const USER_DATA: User = {
  id: 1,
  email: "test@gmail.com",
  role: "user",
  hasAssignedTeam: true,
  ...USER_MODEL_MOCK,
} as unknown as User;

export const USER_DATA_WITH_NO_ASSIGNED_TEAM: User = {
  id: 1,
  email: "test@gmail.com",
  role: "user",
  hasAssignedTeam: false,
  ...USER_MODEL_WITH_NO_ASSIGNED_TEAM_MOCK,
} as unknown as User;