FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=auth-service

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=builder /app/apps/auth-service/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 4001
CMD ["node", "dist/main.js"]