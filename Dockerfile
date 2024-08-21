# Build Stage
FROM node:20 AS builder

WORKDIR /app

# 필요한 파일들만 복사 (의존성 파일)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# Production Stage
FROM node:20 AS production

WORKDIR /app

# 프로덕션 모드 설정
ENV NODE_ENV production

# 의존성 설치 (프로덕션 환경에서만 필요한 패키지)
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --prod --frozen-lockfile

# 빌드된 파일만 복사
COPY --from=builder /app/dist ./dist

# 환경 변수 및 포트 설정
EXPOSE 3000

# 헬스체크 추가 (옵션)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "run", "start:prod"]
