import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/v1"
    PROJECT_NAME: str = "LawGPT"
    
    # Base URL for API (for generating file URLs)
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000/api")
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./new_app.db")
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "")
    USE_MONGODB: bool = bool(os.getenv("USE_MONGODB", "False") == "True")
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    
    # File upload settings
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "pdf", "doc", "docx"]
    
    # Google API settings
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")

    
    # GROQ API settings
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Vector database settings
    VECTOR_STORE_PATH: str = "my_vector_store"
    
    # Embedding model settings
    EMBEDDING_MODEL: str = "models/embedding-001"
    
    # LLM settings
    LLM_MODEL: str = "llama3-70b-8192"
    
    # Translation settings
    ENABLE_TRANSLATION: bool = True
    
    # Supported languages
    SUPPORTED_LANGUAGES: dict = {
        "English": "en",
        "Hindi": "hi",
        "Marathi": "mr"
    }

    # Legal categories
    LEGAL_CATEGORIES: List[str] = [
        "Know Your Rights",
        "Criminal Law",
        "Civil Law",
        "Family Law",
        "Cyber Law",
        "Property Law",
        "Consumer Law",
        "Corporate Law",
    ]
    
    # Chunk size for document splitting
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Retrieval settings
    RETRIEVAL_K: int = 4

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mysecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Redis cache settings (optional)
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    ENABLE_CACHE: bool = bool(os.getenv("ENABLE_CACHE", "False") == "True")
    
    # Monitoring
    ENABLE_MONITORING: bool = bool(os.getenv("ENABLE_MONITORING", "False") == "True")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
