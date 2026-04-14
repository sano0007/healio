FROM oven/bun:1.1.38-alpine AS builder
WORKDIR /app

# Copy all workspace package.json files for dependency resolution (no lockfile = fresh resolve)
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

RUN bun install

# Satisfy turbo globalDependencies without leaking secrets
RUN touch .env .env.example

# Copy source (dist/ and node_modules/ excluded by .dockerignore)
COPY packages/shared-types ./packages/shared-types
COPY apps/auth-service ./apps/auth-service

RUN bun run build --filter=auth-service

FROM oven/bun:1.1.38-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=builder /app/apps/auth-service/package.json .

EXPOSE 5001
CMD ["node", "dist/main.js"]
