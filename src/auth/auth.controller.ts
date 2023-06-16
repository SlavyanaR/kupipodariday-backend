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
import { RequestWithUser } from 'src/utils/request-with-user';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GROUP_USER } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: RequestWithUser) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @SerializeOptions({ groups: [GROUP_USER] })
  async signup(@Body() createUserDto: CreateUserDto) {
    const { about, ...rest } = createUserDto;
    const dto = (about === '' ? rest : createUserDto) as CreateUserDto;

    const user = await this.userService.create(dto);
    this.authService.auth(user);
    return user;
  }
}
