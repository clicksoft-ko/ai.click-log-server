import { Request } from 'express'

export function getIp(req: Request): string | undefined {
  const xOriginForwardedFor = req.headers['x-original-forwarded-for'] as string;
  if (xOriginForwardedFor) {
    return xOriginForwardedFor.split(":")[0];
  }

  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  const realIp = req.headers['x-real-ip'] as string;
  if (realIp) {
    return realIp;
  }

  return req.ip as string;
}

export function getIp2(req: Request) {
  const xOriginForwardedFor = req.headers['x-original-forwarded-for'] as string;
  if (xOriginForwardedFor) {
    return xOriginForwardedFor.split(":")[0];
  }

  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  const realIp = req.headers['x-real-ip'] as string;
  if (realIp) {
    return realIp;
  }

  return req.headers;
}