import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import exceptions from '../utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    const isVerified = await this.hashService.verify(pass, user.password);

    if (!isVerified) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }
    return isVerified ? user : null;
  }
}
