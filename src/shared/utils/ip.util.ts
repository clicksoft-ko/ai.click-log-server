import { Request } from 'express'

export function getIp(req: Request): string {
  const xOriginForwardedFor = req.headers['x-original-forwarded-for'] as string;
  if (xOriginForwardedFor) {
    return xOriginForwardedFor.split(":")[0];
  }

  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const realIp = req.headers['x-real-ip'] as string;
  if (realIp) {
    return realIp;
  }

  let ipAddress = req.ip as string;

  // IPv6 주소 형식이면서 IPv4-mapped IPv6 주소인 경우 IPv4 주소 부분만 추출
  if (ipAddress && ipAddress.startsWith('::ffff:')) {
    ipAddress = ipAddress.substring(7); // "::ffff:".length === 7
  }

  return ipAddress ?? "";
}
