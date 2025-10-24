import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CurrencyResponseDto } from "./dto/currency-response.dto";

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  async getCurrency(): Promise<CurrencyResponseDto> {
    try {
      const response = await fetch("https://sqb.uz/api/site-kurs-api/");

      if (!response.ok) {
        throw new InternalServerErrorException(
          `External API failed with status: ${response.status}`
        );
      }

      const textBody = await response.text();
      const data = JSON.parse(textBody);

      const usdData = data?.data?.offline?.find(
        (currency: any) => currency.code.toLowerCase() === "usd"
      );

      if (!usdData || !usdData.buy || !usdData.sell) {
        throw new NotFoundException(
          "USD currency rate not found in API response"
        );
      }

      return {
        buy: parseFloat(usdData.buy) / 100,
        sell: parseFloat(usdData.sell) / 100,
      };
    } catch (error) {
      this.logger.error(
        "Failed to fetch or process currency data",
        (error as any).stack
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch currency rates");
    }
  }
}
