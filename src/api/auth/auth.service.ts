import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { EnvService } from '@/modules/env/env.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async signin(dto: SigninDto) {
    if (dto.userId !== "testuser" || dto.password !== "testpass") {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync({ isAuthenticated: true } satisfies AuthPayloadDto),
    };
  }

  async check(): Promise<AuthPayloadDto> {
    return {
      isAuthenticated: true,
    };
  }
}
