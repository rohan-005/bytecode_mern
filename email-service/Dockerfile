# Dockerfile - ByteCode Email Microservice Container
FROM node:20-slim

# Install curl for container healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Set permissions for non-root node user
RUN chown -R node:node /app

# Set default environment variables
ENV PORT=5001 \
    NODE_ENV=production

# Expose microservice port
EXPOSE 5001

# Use non-root node user
USER node

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5001}/health || exit 1

# Start email microservice
CMD ["node", "server.js"]
