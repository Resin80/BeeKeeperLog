# --- Stage 1: Build the Frontend ---
FROM node:20-alpine AS ui-builder
WORKDIR /app
COPY package*.json ./
COPY packages/ui/package*.json ./packages/ui/
COPY packages/api/package*.json ./packages/api/
RUN npm install --workspaces
COPY packages/ui ./packages/ui
RUN npm run build --workspace=packages/ui

# --- Stage 2: Build the Backend ---
FROM node:20-alpine AS api-builder
WORKDIR /app
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
RUN npm install --workspace=packages/api
COPY packages/api ./packages/api
# Generate Prisma Client
RUN cd packages/api && npx prisma generate
# Transpile TypeScript to JavaScript
RUN cd packages/api && npx tsc

# --- Stage 3: Final Production Image ---
FROM node:20-alpine
WORKDIR /app

# Copy production dependencies only
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
RUN npm install --workspace=packages/api --omit=dev

# Copy built frontend from Stage 1
COPY --from=ui-builder /app/packages/ui/dist ./packages/ui/dist

# Copy transpiled API and generated Prisma client from Stage 2
COPY --from=api-builder /app/packages/api/dist ./packages/api/dist
COPY --from=api-builder /app/packages/api/node_modules/.prisma ./app/packages/api/node_modules/.prisma
COPY packages/api/prisma ./packages/api/prisma

# Create a data directory for the persistent SQLite database
RUN mkdir -p /data
ENV DATABASE_URL="file:/data/bee-keeper-log.db"
ENV PORT=3001
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3001

# Start script
RUN echo '#!/bin/sh' > /app/run.sh && \
    echo 'cd /app/packages/api' >> /app/run.sh && \
    echo 'npx prisma generate' >> /app/run.sh && \
    echo 'npx prisma db push --skip-generate' >> /app/run.sh && \
    echo 'node dist/src/index.js' >> /app/run.sh && \
    chmod +x /app/run.sh

CMD ["/app/run.sh"]
