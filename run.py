"""
PostStudio Application Runner
Launches both the Python FastAPI backend (Port 8000) and the Vite frontend (Port 3000).
Run with: python run.py
"""

import subprocess
import sys
import time
import os
import signal

def run_poststudio():
    print("=" * 60)
    print("  🚀 POSTSTUDIO: PYTHON MULTI-AGENT LINKEDIN SYSTEM")
    print("=" * 60)
    print("  [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000...")
    
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app:app", "--app-dir", "backend", "--host", "127.0.0.1", "--port", "8000"],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )

    time.sleep(2)

    print("  [2/2] Starting Frontend Studio on http://localhost:3000...")
    frontend_proc = subprocess.Popen(
        "npm run dev -- --port 3000",
        shell=True,
        cwd=os.path.dirname(os.path.abspath(__file__))
    )

    print("\n  ✨ PostStudio is LIVE!")
    print("  - Web Studio:      http://localhost:3000")
    print("  - Python API Docs: http://127.0.0.1:8000/docs")
    print("  - Health Check:    http://127.0.0.1:8000/api/health")
    print("  Press Ctrl+C to stop both servers.\n" + "=" * 60)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping PostStudio...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    run_poststudio()

