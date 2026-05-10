# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
# Ensure data directory exists for SQLite
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV DATABASE_URL=/app/data/products.db

EXPOSE 3000
CMD ["npm", "start"]
