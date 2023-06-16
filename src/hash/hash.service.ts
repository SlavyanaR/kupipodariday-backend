import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from 'src/configuration/configuration';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async generate(pass: string): Promise<string> {
    const salt = configuration().hash.salt;
    return await bcrypt.hash(pass, salt);
  }

  async verify(pass: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(pass, hash);
  }
}
