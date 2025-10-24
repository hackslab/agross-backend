import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCountryDto {
  @ApiProperty({ description: "Country name", example: "Uzbekistan" })
  @IsString()
  @IsNotEmpty()
  name: string;
}
