import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiResponse({
    status: 200,
    type: SigninResponseDto,
  })
  @Post("/signin")
  @HttpCode(200)
  signin(@Body() dto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.signin(dto);
  }

  @ApiResponse({
    status: 200,
    type: AuthPayloadDto,
  })
  @Post("/check")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  check(): Promise<AuthPayloadDto> {
    return this.authService.check();
  }
} 