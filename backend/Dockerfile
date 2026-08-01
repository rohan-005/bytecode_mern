# Dockerfile - ByteCode Backend Container with Online Compiler Toolchain
FROM node:20-slim

# Install system compiler toolchains for multi-language code execution
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    make \
    python3 \
    python3-pip \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package manifests first for optimal layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Set up write and execution permissions for non-root user
RUN chown -R node:node /app /tmp

# Set default environment variables
ENV PORT=5000 \
    NODE_ENV=production

# Expose backend port
EXPOSE 5000

# Use non-root node user for container security
USER node

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5000}/api/health || exit 1

# Start production backend server
CMD ["node", "server.js"]
