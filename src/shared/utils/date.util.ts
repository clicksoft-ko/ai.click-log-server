import * as dayjs from "dayjs";

export const dbNow = (): Date => dayjs().add(9, "hour").toDate();
export const koDayjs = (date?: dayjs.ConfigType): dayjs.Dayjs => dayjs(date).tz('Asia/Seoul');
export const usDayjs = (date?: dayjs.ConfigType): dayjs.Dayjs => dayjs(date).tz('America/New_York');