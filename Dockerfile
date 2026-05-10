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
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/app/db ./app/db
# Ensure data directory exists for SQLite and Uploads
RUN mkdir -p /app/data/uploads/full /app/data/uploads/thumb

# Symlink persistent uploads to public folder for static serving
RUN ln -s /app/data/uploads /app/public/uploads

ENV NODE_ENV=production
ENV DATABASE_URL=/app/data/products.db
ENV HOST=0.0.0.0
ENV PORT=3000
ENV UPLOADS_PATH=/app/data/uploads

EXPOSE 3000
CMD ["sh", "-c", "mkdir -p /app/data/uploads/full /app/data/uploads/thumb && npm run db:migrate && npm run db:seed && npm start"]
