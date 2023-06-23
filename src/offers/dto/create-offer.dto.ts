import { IsBoolean, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateOfferDto {
  @IsPositive()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsPositive()
  itemId: number;
}
