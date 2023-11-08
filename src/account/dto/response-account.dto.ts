import { Team } from "src/team/entities/team.entity";
import { User } from "src/user/schemas/user.schema";

export class ResponseAccountDto {
  id?: string;
  name: string;
  clientName: string;
  responsable: User;
  teams: Team[];
}