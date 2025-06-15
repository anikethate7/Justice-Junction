from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from app.config import settings

# Create SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create metadata instance
metadata = MetaData()

# Create database instance
database = Database(settings.DATABASE_URL)

async def get_db():
    """Get database connection"""
    await database.connect()
    try:
        yield database
    finally:
        await database.disconnect()

# Base model class
Base = declarative_base() 