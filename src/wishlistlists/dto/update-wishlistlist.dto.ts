import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistlistDto } from './create-wishlistlist.dto';
import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistlistDto extends PartialType(CreateWishlistlistDto) {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
