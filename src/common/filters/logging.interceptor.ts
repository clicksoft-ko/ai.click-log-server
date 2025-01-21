import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;

    // 요청 로깅
    this.logger.log(
      `Request: ${method} ${url} \nBody: ${JSON.stringify(
        body,
      )} \nQuery: ${JSON.stringify(query)} \nParams: ${JSON.stringify(params)}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((response) => {
        // 응답 로깅
        const responseTime = Date.now() - now;
        this.logger.log(
          `Response: ${method} ${url} \nStatus: ${
            context.switchToHttp().getResponse().statusCode
          } \nResponse Time: ${responseTime}ms \nResponse Body: ${JSON.stringify(
            response,
          )}`,
        );
      }),
    );
  }
}
