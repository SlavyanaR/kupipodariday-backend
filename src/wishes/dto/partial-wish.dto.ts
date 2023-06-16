import { IsDateString, IsInt, IsUrl, Length, Min } from 'class-validator';

export class PartialWishDto {
  @IsInt()
  id: number;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @Min(1)
  price: number;

  @Min(1)
  raised: number;
  copied: number;

  @Length(1, 1024)
  description: string;
}
