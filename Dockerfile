FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY prisma ./prisma

RUN corepack enable pnpm && pnpm install --frozen-lockfile;

COPY . .

RUN npm run build

# Production
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

CMD [ "npm", "run", "start:prod" ]