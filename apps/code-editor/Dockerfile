# --- Step 1: Builder Image ---
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package manager files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install --force

# Explicitly copy config file
COPY next.config.js ./ 

# Copy rest of the project
COPY . .

# Build the Next.js app
RUN npm run build

# --- Step 2: Minimal Runtime Image ---
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js  # ✅ safe now

# Optional: copy env file
# COPY --from=builder /app/.env.production ./.env.production

ENV NODE_ENV=production
EXPOSE 3000

# Start app
CMD ["npm", "start"]
