import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  SerializeOptions,
  //Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
//import { GROUP_USER } from 'src/utils/constants';
//import { RequestWithUser } from 'src/utils/request-with-user';
//import { FindUserDto } from './dto/find-user.dto';
import { AuthUser } from 'src/utils/auth-user.decorator';
import { User } from './entities/user.entity';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SerializeOptions({ groups: ['private'] })
  @Get('me')
  async getOwnUser(@AuthUser() user: User): Promise<UserProfileResponseDto> {
    return this.usersService.findById(user.id);
  }

  @Get(':username')
  async getByUsername(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne(username);
  }

  @Post('find')
  async findByUserNameOrEmail(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }

  @SerializeOptions({ groups: ['private'] })
  @Patch('me')
  async updateUser(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getOwnUserWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.usersService.findUserWishes(user.id);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findOne(username);

    return this.usersService.findUserWishes(user.id);
  }
}
