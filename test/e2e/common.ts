import { SigninDto } from "@/api/auth/dto/signin.dto";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';

export const signinTest = async (app: INestApplication) => {
  const response = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({
      userId: 'testuser',
      password: 'testpass'
    } satisfies SigninDto);

  return {
    status: response.status,
    accessToken: response.body.accessToken,
  };
}