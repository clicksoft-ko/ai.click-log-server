import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { EnvService } from '@/modules/env/env.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly envService: EnvService) { }

  async signin(dto: SigninDto) {
    if (dto.userId !== this.envService.USER_ID || dto.password !== this.envService.PASSWORD) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtService.signAsync({ isAuthenticated: true } satisfies AuthPayloadDto);

    return {
      accessToken,
    };
  }

  async check(): Promise<AuthPayloadDto> {
    return {
      isAuthenticated: true,
    };
  }
}
