import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  OnModuleInit,
} from '@nestjs/common';
import { Counter, Gauge, Histogram } from 'prom-client';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Request } from 'express'

@Injectable()
export class PrometheusInterceptor implements NestInterceptor, OnModuleInit {
  onModuleInit() {
    this.requestSuccessHistogram.reset();
    this.requestFailHistogram.reset();
    this.failureCounter.reset();
  }
  // status code 2XX
  private readonly requestSuccessHistogram = new Histogram({
    name: 'nestjs_success_requests',
    help: 'NestJs success requests - duration in seconds',
    labelNames: ['path', 'method'],
    buckets: [
      0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1,
      2.5, 5, 10,
    ],
  });

  // status code != 2XX
  private readonly requestFailHistogram = new Histogram({
    name: 'nestjs_fail_requests',
    help: 'NestJs fail requests - duration in seconds',
    labelNames: ['path', 'method'],
    buckets: [
      0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1,
      2.5, 5, 10,
    ],
  });

  private readonly failureCounter = new Counter({
    name: 'nestjs_requests_failed_count',
    help: 'NestJs requests that failed',
    labelNames: ['path', 'error', 'method'],
  });

  static registerServiceInfo(serviceInfo: {
    domain: string;
    name: string;
    version: string;
  }): PrometheusInterceptor {
    new Gauge({
      name: 'nestjs_info',
      help: 'NestJs service version info',
      labelNames: ['domain', 'name', 'version'],
    }).set(
      {
        domain: serviceInfo.domain,
        name: `${serviceInfo.domain}.${serviceInfo.name}`,
        version: serviceInfo.version,
      },
      1,
    );

    return new PrometheusInterceptor();
  }

  // metrics url 요청은 트래킹 필요 x
  private isAvailableMetricsUrl(url: string): boolean {
    const excludePaths = 'metrics';
    if (url.includes(excludePaths)) {
      return false;
    }
    return true;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as Request;
    const labels = {
      path: req.path,
      method: req.method,
    };

    const requestSuccessTimer =
      this.requestSuccessHistogram.startTimer(labels);
    const requestFailTimer = this.requestFailHistogram.startTimer(labels);

    return next.handle().pipe(
      tap({
        next: () => {
          if (this.isAvailableMetricsUrl(req.path)) {
            requestSuccessTimer();
          }
        },
        error: () => {
          if (this.isAvailableMetricsUrl(req.path)) {
            requestFailTimer();
          }
        },
      }),
      catchError((err) => {
        this.failureCounter.labels({ ...labels, error: err.name }).inc(1);
        return throwError(() => err);
      }),
    );
  }
}