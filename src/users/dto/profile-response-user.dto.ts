import { IsDateString, IsInt, IsString, IsUrl, Length } from 'class-validator';

export class ProfileResponseUserDto {
  @IsInt()
  id: number;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
