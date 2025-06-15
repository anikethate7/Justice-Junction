#!/usr/bin/env python3
"""
Production server script for the JusticeJunction API.
Compatible with platforms like Render that set PORT via environment variable.
"""

import os
import uvicorn

if __name__ == "__main__":
    print("Starting JusticeJunction API server...")
    port = int(os.environ.get("PORT", 10000))  # Use Render's port or default to 10000
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
