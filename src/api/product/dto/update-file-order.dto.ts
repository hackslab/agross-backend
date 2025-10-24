import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class FileOrderDto {
  @IsUUID()
  @IsNotEmpty()
  fileId: string;

  @IsInt()
  @IsNotEmpty()
  order: number;
}

export class UpdateFileOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileOrderDto)
  files: FileOrderDto[];
}
