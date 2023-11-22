import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
  @ApiProperty({required: false})
  name: string;

  @ApiProperty({required: false})
  clientName: string;

  //This is the responsable, user, id.
  @ApiProperty({required: false})
  responsable: string;
}
