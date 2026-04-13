FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/doctor-service ./apps/doctor-service

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=doctor-service

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/doctor-service/dist ./dist
COPY --from=builder /app/apps/doctor-service/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 4003
CMD ["node", "dist/main.js"]