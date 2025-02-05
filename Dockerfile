FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY prisma ./prisma

RUN npm install -g corepack@latest
RUN corepack enable pnpm && pnpm install --frozen-lockfile;

COPY . .

RUN npm run build

# Production
FROM node:20-slim

# OpenSSL 설치
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

CMD [ "npm", "run", "start:prod" ]