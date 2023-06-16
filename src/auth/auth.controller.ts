import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
//import { RequestWithUser } from 'src/utils/request-with-user';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/utils/auth-user.decorator';
import { SigninResponseDto } from './dto/signin-response.dto';
//import { GROUP_USER } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@AuthUser() user: User): SigninResponseDto {
    return this.authService.auth(user);
  }

  @SerializeOptions({ groups: ['private'] })
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SigninResponseDto> {
    const user = await this.userService.create(createUserDto);
    return this.authService.auth(user);
  }
}
