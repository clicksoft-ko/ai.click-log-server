import { CompressionOptions } from 'compression';

export const compressionConfig: CompressionOptions = {
  level: 6,
  strategy: 0,
  threshold: 1024, // 1KB 이상일 때만 압축
  brotli: {
    enabled: true,
    zlib: {
      level: 11,
      windowBits: 22,
      memLevel: 8,
      strategy: 0
    }
  }
}; 