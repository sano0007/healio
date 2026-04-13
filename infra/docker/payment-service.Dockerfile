FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/payment-service ./apps/payment-service

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=payment-service

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/payment-service/dist ./dist
COPY --from=builder /app/apps/payment-service/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 4006
CMD ["node", "dist/main.js"]