import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dbNow = (): Date => dayjs().add(9, 'hour').toDate();
export const koDayjs = (date?: dayjs.ConfigType): dayjs.Dayjs =>
  dayjs(date).tz('Asia/Seoul');
export const usDayjs = (date?: dayjs.ConfigType): dayjs.Dayjs =>
  dayjs(date).tz('America/New_York');
