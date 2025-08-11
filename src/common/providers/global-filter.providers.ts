import { Provider, UnauthorizedException } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionsFilter } from "../filters/all-exceptions.filter";
import { PrometheusInterceptor } from "../interceptors/prometheus.interceptor";
import { LoggingInterceptor } from "../filters/logging.interceptor";

export const globalFilterProviders: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
  {
    provide: APP_FILTER,
    useClass: UnauthorizedException,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: PrometheusInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  }
]