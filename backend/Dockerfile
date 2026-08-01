# Dockerfile - ByteCode Backend Container
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Set default environment variables
ENV PORT=5000 \
    NODE_ENV=production

# Expose backend port dynamically
EXPOSE 5000

# Non-root user execution
USER node

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5000}/api/health || exit 1

# Default command
CMD ["node", "server.js"]
