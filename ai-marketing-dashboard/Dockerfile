FROM node:20-alpine AS base

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build

# Production server - use standalone output
FROM node:20-alpine AS runner
WORKDIR /app

# Copy standalone build output
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
