FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/appointment-service ./apps/appointment-service

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=appointment-service

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/appointment-service/dist ./dist
COPY --from=builder /app/apps/appointment-service/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 4004
CMD ["node", "dist/main.js"]