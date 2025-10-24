import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CurrencyService } from "./currency.service";
import { CurrencyResponseDto } from "./dto/currency-response.dto";

@ApiTags("Currency")
@Controller("currency")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOperation({ summary: "Get current currency exchange rates" })
  @ApiResponse({
    status: 200,
    description: "Returns current currency rates",
    type: CurrencyResponseDto,
  })
  @Get()
  getCurrency(): Promise<CurrencyResponseDto> {
    return this.currencyService.getCurrency();
  }
}
