import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUnitDto {
  @ApiProperty({ description: "Unit of measurement name", example: "kg" })
  @IsString()
  @IsNotEmpty()
  name: string;
}
