# app.py - Re-exports the FastAPI app from main.py
# This allows running via: uvicorn app:app or gunicorn app:app
from main import app