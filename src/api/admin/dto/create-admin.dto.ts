import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({ description: "Admin full name", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Admin username", example: "johndoe" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "Admin password (min 8 characters)", example: "password123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: "Is superadmin", example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isSuperadmin?: boolean;
}
