import { IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsOptional()
  hidden: boolean;

  itemId: number;
}
