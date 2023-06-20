import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
//import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
 