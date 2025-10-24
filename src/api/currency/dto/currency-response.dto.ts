import { ApiProperty } from "@nestjs/swagger";

export class CurrencyResponseDto {
  @ApiProperty({ example: 12060.0, description: "USD buy rate" })
  buy: number;

  @ApiProperty({ example: 12180.0, description: "USD sell rate" })
  sell: number;
}
