import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const errors = this.getErrors(exception);
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
      errors,
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: errorResponse, args: { req, res } });
    } else {
      this.logger.warn({ err: errorResponse });
    }

    res.status(status).json(errorResponse);
  }

  getStatus(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus()
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
      return exception.getResponse();
    }

    if (exception && typeof exception === "object" && "message" in exception && typeof exception.message === 'string') {
      return exception.message
    }

    return 'Internal server error';
  }
}