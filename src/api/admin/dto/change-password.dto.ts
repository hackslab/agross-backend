import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ description: "New password (min 8 characters)", example: "newPassword123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ description: "Old password (required when changing own password)", example: "oldPassword123", required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  oldPassword?: string;

  @ApiProperty({ description: "Admin ID (required when superadmin changes another admin's password)", example: "uuid-of-admin", required: false })
  @IsOptional()
  @IsUUID()
  adminId?: string;
}
