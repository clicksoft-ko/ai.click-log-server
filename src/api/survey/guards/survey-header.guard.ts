import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SurveyHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const xTestHeader = request.headers['x-survey-header'];

    if (xTestHeader !== 'Y2xpY2s=') {
      throw new BadRequestException('Invalid X-Survey-Header value');
    }

    return true;
  }
}