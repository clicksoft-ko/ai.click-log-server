import { EnvService } from '@/modules/env/env.service';
import { Provider } from '@nestjs/common';
import * as sql from 'mssql';

export const SMS_DB_CONNECTION = 'SMS_DB_CONNECTION';

export const smsDbProviders: Provider[] = [
  {
    provide: SMS_DB_CONNECTION,
    inject: [EnvService],
    useFactory: async (env: EnvService) => {
      const config = JSON.parse(env.SMS_DATABASE_CONFIG);

      try {
        const pool = await sql.connect(config);
        console.log('Connected to the database successfully!');

        return pool;
      } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
      }
    },
  },
];
