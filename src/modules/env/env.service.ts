import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) { }
  get JWT_KEY(): string {
    return this.configService.get<string>('JWT_KEY')!;
  }

  get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV')!;
  }

  get IS_TEST(): boolean {
    return this.NODE_ENV === 'test';
  }

  get USER_ID(): string {
    return this.IS_TEST ? 'testuser' : this.configService.get<string>('USER_ID')!;
  }

  get PASSWORD(): string {
    return this.IS_TEST ? 'testpass' : this.configService.get<string>('PASSWORD')!;
  }

  get CLICK_HEADER_KEY(): string {
    return this.configService.get<string>('CLICK_HEADER_KEY')!;
  }

  get CLICK_HEADER_VALUE(): string {
    return this.configService.get<string>('CLICK_HEADER_VALUE')!;
  }
}
