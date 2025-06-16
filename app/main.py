from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
import os
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.router import api_router
from app.config import settings
from app.middleware import MetricsMiddleware, LoggingMiddleware

# Create needed directories at startup
os.makedirs("./LEGAL-DATA", exist_ok=True)
os.makedirs("./LEGAL-DATA/user_uploads", exist_ok=True)

app = FastAPI(
    title="LawGPT API",
    description="A legal chatbot API using RAG architecture",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS - Fixed for your specific URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite dev server
        "http://localhost:8080",  # Alternative local port
        "https://justice-junction-seven.vercel.app",  # Your Vercel URL
        "https://justice-junction-seven.vercel.app/",  # With trailing slash
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add monitoring and logging middleware if enabled
if settings.ENABLE_MONITORING:
    app.add_middleware(MetricsMiddleware)
    app.add_middleware(LoggingMiddleware)

# Handle exceptions
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Handle CORS preflight requests
@app.options("/{full_path:path}")
async def options_handler(request: Request, full_path: str):
    return JSONResponse(
        content="OK",
        headers={
            "Access-Control-Allow-Origin": "https://justice-junction-seven.vercel.app",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Create uploads directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Mount uploads directory to serve static files
app.mount("/api/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API router
app.include_router(api_router, prefix="/api")

# Define path to the React app build directory
REACT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "lawgpt-frontend/dist")

# Mount the static files from the React app
if os.path.exists(REACT_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(REACT_DIR, "assets")), name="assets")

# Add health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "cors_origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://justice-junction-seven.vercel.app"
        ],
        "api_url": "https://justice-junction.onrender.com"
    }

# Add metrics endpoint
@app.get("/metrics")
async def metrics(request: Request):
    """Prometheus metrics endpoint."""
    return PlainTextResponse(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """Serve the React app for any path not matched by other routes."""
    if full_path.startswith("api/"):
        # This shouldn't happen since the API router is included first
        raise HTTPException(status_code=404, detail="API route not found")
    
    # For all other paths, serve the React app's index.html
    index_path = os.path.join(REACT_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"message": "React frontend not found. Make sure to build it first."}

@app.get("/")
async def root():
    return {
        "message": "Welcome to JusticeJunction API",
        "frontend": "https://justice-junction-seven.vercel.app",
        "api_docs": "https://justice-junction.onrender.com/docs",
        "health": "https://justice-junction.onrender.com/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)