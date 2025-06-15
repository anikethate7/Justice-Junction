#!/usr/bin/env python3
"""
Development/Production server script for the JusticeJunction API.
Compatible with platforms like Render that set PORT via environment variable.
"""

import os
import uvicorn

if __name__ == "__main__":
    print("Starting JusticeJunction API server...")
    port = int(os.environ.get("PORT", 8000))  # Use Render's port or default to 8000
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
