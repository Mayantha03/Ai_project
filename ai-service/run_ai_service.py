"""
Convenience launcher for the Smart Campus AI Microservice.
Runs Uvicorn server on http://localhost:8000
"""

import uvicorn
import os
import sys

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=" * 60)
    print("Starting Smart Campus AI Microservice on http://localhost:8000")
    print("Docs available at: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
