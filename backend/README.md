# ByteCode Backend Service

Production Node.js Express backend for the ByteCode Developer Platform featuring online code compilation, course pathways, authentication, and user progress tracking.

## Dockerized Environment

The backend includes a production Dockerfile preconfigured with compiler toolchains for multi-language online code execution (C, C++, Python 3, Node.js).

### Building the Docker Image

```bash
docker build -t bytecode-backend ./backend
```

### Running with Docker

```bash
docker run -d \
  -p 5000:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e MONGO_URI="mongodb://localhost:27017/bytecode" \
  -e JWT_SECRET="your_secret_key" \
  --name bytecode-backend \
  bytecode-backend
```

### Running with Docker Compose

To spin up the entire stack including Backend, MongoDB, and Redis:

```bash
docker-compose up -d --build
```

### Verification & Health Check

```bash
curl http://localhost:5000/api/health
```

Compiler runtime versions inside the container:
- Node.js (`node --version`)
- Python 3 (`python3 --version`)
- C / C++ Compiler (`g++ --version`, `gcc --version`)
