import { ErrorResponseDto } from '@/shared/dto/error-response.dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { query, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const errors = this.getErrors(exception);
    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
      errors,
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(errorResponse.message, {
        err: errorResponse,
        body: req.body,
        params: req.params,
        query: req.query,
      });
    } else {
      this.logger.warn(errorResponse.message);
    }

    res.status(status).json(errorResponse);
  }

  getStatus(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof ZodError) {
      return 400;
    }
    return 500;
  }

  getErrors(exception: unknown) {
    if (exception instanceof ZodError) {
      return exception.flatten().fieldErrors;
    }
  }

  getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      return typeof exceptionResponse == 'string'
        ? exceptionResponse
        : (exceptionResponse['message'] as string);
    }

    if (exception instanceof ZodError) {
      const formattedIssues = exception.issues.map((issue) => {
        const path = issue.path.join('.');
        const message = issue.message;
        return `"${path}": ${message}`;
      });

      // Join all formatted issues into a single string
      return `Validation error on (${formattedIssues.join('|')})`;
    }

    if (
      exception &&
      typeof exception === 'object' &&
      'message' in exception &&
      typeof exception.message === 'string'
    ) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
