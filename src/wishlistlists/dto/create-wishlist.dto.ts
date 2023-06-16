import { IsArray, IsOptional, IsUrl, Length, MaxLength } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @MaxLength(1500)
  @IsOptional()
  description: string;

  @IsArray()
  itemsId: number[];
}
