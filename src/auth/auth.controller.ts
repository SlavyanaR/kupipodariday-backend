import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard  } from './local-auth.guard';
import { RequestWithUser } from '../utils/request-with-user';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { GROUP_USER } from '../utils/constants';


@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard )
  @Post('signin')
  signin(@Req() req: RequestWithUser) {
    return this.authService.auth(req.user);
  }

  @SerializeOptions({ groups: ['private'] })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto,
  ) {
    const { about, ...rest } = createUserDto;
    const dto = (about === '' ? rest : createUserDto) as CreateUserDto;

    const user = await this.usersService.create(dto);
    this.authService.auth(user);
    return user;
  }
}