FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json turbo.json bun.lock* ./
COPY packages ./packages
COPY apps/patient-service ./apps/patient-service

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile
RUN pnpm run build --filter=patient-service

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/patient-service/dist ./dist
COPY --from=builder /app/apps/patient-service/package.json .

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

EXPOSE 4002
CMD ["node", "dist/main.js"]