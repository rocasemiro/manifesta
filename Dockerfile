# Stage 1: Build Frontend and Server
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Vite SPA and bundle Express server
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production package.json and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start Node.js server
CMD ["node", "dist/server.cjs"]
