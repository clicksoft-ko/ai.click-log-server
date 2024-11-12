import { apiHeader } from '@/constants/api-header';
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ClickHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const xTestHeader = request.headers[apiHeader.click.key.toLowerCase()];

    if (xTestHeader !== apiHeader.click.value) {
      throw new BadRequestException(`Invalid ${apiHeader.click.key} value`);
    }

    return true;
  }
}