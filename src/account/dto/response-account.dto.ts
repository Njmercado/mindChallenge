import { Group } from "src/group/entities/group.entity";
import { User } from "src/user/schemas/user.schema";

export class ResponseAccountDto {
  id?: string;
  name: string;
  clientName: string;
  responsable: User;
  groups: Group[];
}