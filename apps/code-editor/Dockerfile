# --- Step 1: Builder Image ---
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install system deps
RUN apk add --no-cache libc6-compat

# Install pnpm
RUN npm install -g pnpm

# Copy package manager files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the Next.js app
RUN pnpm build

# --- Step 2: Minimal Runtime Image ---
FROM node:18-alpine AS runner

WORKDIR /app

# Install pnpm to run the app
RUN npm install -g pnpm

# Copy only the required files from the builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Optional: copy .env.production or use secrets
# COPY --from=builder /app/.env.production ./.env.production

ENV NODE_ENV=production
EXPOSE 3000

# Start Next.js app
CMD ["pnpm", "start"]
