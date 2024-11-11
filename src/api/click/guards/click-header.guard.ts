import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ClickHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const xTestHeader = request.headers['x-click-header'];

    if (xTestHeader !== 'Y2xpY2stc29mdA==') {
      throw new BadRequestException('Invalid X-Click-Header value');
    }

    return true;
  }
}