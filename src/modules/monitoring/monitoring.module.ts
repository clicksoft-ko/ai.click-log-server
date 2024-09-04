import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics', // 메트릭 노출 경로
    }),
  ],
  exports: [PrometheusModule],
})
export class MonitoringModule { }
