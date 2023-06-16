import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
