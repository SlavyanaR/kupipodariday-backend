import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne({ where: { username } });

    if (user && user.password) {
      const isVerified = await this.hashService.verify(pass, user.password);

      return isVerified ? user : null;
    }

    return null;
  }
}
