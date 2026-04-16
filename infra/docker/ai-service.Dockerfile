FROM oven/bun:1.1.38-alpine AS builder
WORKDIR /app

COPY package.json turbo.json ./
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY apps/auth-service/package.json ./apps/auth-service/package.json
COPY apps/patient-service/package.json ./apps/patient-service/package.json
COPY apps/doctor-service/package.json ./apps/doctor-service/package.json
COPY apps/appointment-service/package.json ./apps/appointment-service/package.json
COPY apps/telemedicine-service/package.json ./apps/telemedicine-service/package.json
COPY apps/payment-service/package.json ./apps/payment-service/package.json
COPY apps/notification-service/package.json ./apps/notification-service/package.json
COPY apps/ai-service/package.json ./apps/ai-service/package.json

RUN bun install

RUN touch .env .env.example

COPY packages/shared-types ./packages/shared-types
COPY apps/ai-service ./apps/ai-service

RUN bun run build --filter=ai-service

FROM oven/bun:1.1.38-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/ai-service/dist ./dist
COPY --from=builder /app/apps/ai-service/package.json .

EXPOSE 5008
CMD ["node", "dist/main.js"]
