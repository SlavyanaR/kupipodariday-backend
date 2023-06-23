import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  SerializeOptions,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { GROUP_USER } from '../utils/constants';
import { AuthUser } from '../utils/auth-user.decorator';
import { User } from './entities/user.entity';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @SerializeOptions({ groups: [GROUP_USER] })
  async getUser(@AuthUser() user: User): Promise<UserProfileResponseDto> {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @SerializeOptions({ groups: [GROUP_USER] })
  async updateUser(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.usersService.findUserWishes(user.id);
  }

  @Get(':username')
  async getByUsername(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findOne(username);

    return this.usersService.findUserWishes(user.id);
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
