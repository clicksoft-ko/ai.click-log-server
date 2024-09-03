import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

// 플러그인 확장
dayjs.extend(utc);
dayjs.extend(timezone);