FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/telemedicine-service ./apps/telemedicine-service

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=telemedicine-service

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/telemedicine-service/dist ./dist
COPY --from=builder /app/apps/telemedicine-service/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 4005
CMD ["node", "dist/main.js"]