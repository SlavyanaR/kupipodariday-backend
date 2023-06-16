import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async generate(pass: string) {
    return await bcrypt.hash(pass, this.configService.get('saltRound'));
  }

  async verify(pass: string, hash: string) {
    return await bcrypt.compare(pass, hash);
  }
}
