import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async generate(pass: string): Promise<string> {
    return await bcrypt.hash(pass, this.configService.get('saltRound'));
  }

  async verify(pass: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(pass, hash);
  }
}
