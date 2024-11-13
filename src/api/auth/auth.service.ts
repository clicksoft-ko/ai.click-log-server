import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async signin(dto: SigninDto) {
    if (dto.userId !== process.env.USER_ID || dto.password !== process.env.PASSWORD) {
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
