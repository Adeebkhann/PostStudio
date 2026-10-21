# ==============================================================================
# Stage 1: Build the React Frontend (Vite + TailwindCSS)
# ==============================================================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Install npm dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Python FastAPI Backend + Static Frontend Production Server
# ==============================================================================
FROM python:3.11-slim AS production
WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend ./backend

# Copy built frontend assets from Stage 1 into /app/dist
COPY --from=frontend-builder /app/dist ./dist

# Render provides the PORT environment variable dynamically
ENV PORT=8000
EXPOSE 8000

# Start Uvicorn pointing to backend/app.py
CMD sh -c "python -m uvicorn app:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}"
