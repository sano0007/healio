FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=api-gateway

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 3001
CMD ["node", "dist/main.js"]