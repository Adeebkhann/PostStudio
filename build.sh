#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "==> Installing Node dependencies..."
npm install

echo "==> Building React Vite Frontend..."
npm run build

echo "==> Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "==> Build complete! Ready to start Uvicorn."
