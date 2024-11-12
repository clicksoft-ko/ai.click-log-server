import { apiHeader } from '@/constants/api-header';
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SurveyHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const xTestHeader = request.headers[apiHeader.survey.key.toLowerCase()];

    if (xTestHeader !== apiHeader.survey.value) {
      throw new BadRequestException(`Invalid ${apiHeader.survey.key} value`);
    }

    return true;
  }
}