from datetime import datetime
from typing import Generator
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import pymongo
import os

from app.config import settings

# MongoDB connection setup
mongo_client = None
mongo_db = None

if settings.USE_MONGODB:
    try:
        print(f"Connecting to MongoDB at {settings.MONGODB_URL}")
        mongo_client = pymongo.MongoClient(settings.MONGODB_URL)
        mongo_db = mongo_client[settings.MONGODB_DB_NAME]
        print(f"Connected to MongoDB database: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"MongoDB connection error: {str(e)}")
        print("Falling back to SQLite database")
        mongo_client = None
        mongo_db = None

# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# User model
class User(Base):
    """SQLAlchemy User model."""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    user_metadata = Column(Text, nullable=True)  # JSON string for custom profile data
    
    # Relationship with conversations
    conversations = relationship("Conversation", back_populates="user")

# Conversation model
class Conversation(Base):
    """SQLAlchemy Conversation model."""
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    session_id = Column(String, index=True, unique=True)
    title = Column(String, nullable=True)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

# Message model
class Message(Base):
    """SQLAlchemy Message model."""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"))
    role = Column(String)  # "user" or "assistant"
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    conversation = relationship("Conversation", back_populates="messages")

# Create all tables
if not settings.USE_MONGODB:
    print("Creating SQLite tables")
    Base.metadata.create_all(bind=engine)
else:
    print("Using MongoDB for storage")
    # Ensure indexes for MongoDB collections if needed
    if mongo_db is not None:
        try:
            # First clean up any documents with null session_id in conversations collection
            print("Cleaning up null session_id records in MongoDB")
            try:
                # Remove documents with null session_id or add a unique session_id
                find_result = mongo_db.conversations.find({"session_id": None})
                for doc in find_result:
                    # Either delete the document or assign a unique session_id
                    mongo_db.conversations.update_one(
                        {"_id": doc["_id"]},
                        {"$set": {"session_id": f"generated_{doc['_id']}_{datetime.utcnow().timestamp()}"}}
                    )
                print("Cleaned up conversations with null session_id")
            except Exception as e:
                print(f"Error cleaning conversations collection: {str(e)}")

            # Create indexes with sparse option for fields that might be null
            mongo_db.users.create_index("username", unique=True)
            mongo_db.users.create_index("email", unique=True)
            mongo_db.conversations.create_index("session_id", unique=True, sparse=True)
            print("MongoDB indexes created")
        except Exception as e:
            print(f"Error creating MongoDB indexes: {str(e)}")

# Dependency
def get_db() -> Generator[Session, None, None]:
    """Get database session."""
    if settings.USE_MONGODB and mongo_db is not None:
        # Return MongoDB database instead
        yield mongo_db
    else:
        # Use SQLite as fallback
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()