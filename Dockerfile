# Dockerfile for Next.js app with standalone output

# 1. Installer
FROM node:20-alpine AS installer

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 2. Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 3. Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./

# Copy the static assets
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
