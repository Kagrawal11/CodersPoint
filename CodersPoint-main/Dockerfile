FROM node:22-slim

# Python + JDK for sandboxed code execution (backend/src/lib/sandbox.js).
# javac (compiler) needs the JDK, not just the JRE.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY frontend/package*.json frontend/
RUN cd frontend && npm install --include=dev

COPY backend/package*.json backend/
RUN cd backend && npm install

COPY frontend/ frontend/
COPY backend/ backend/

RUN cd frontend && npm run build
RUN cd backend && npx prisma generate

ENV NODE_ENV=production
EXPOSE 8080

CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && node src/index.js"]
