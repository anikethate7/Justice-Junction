from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
import bcrypt
from sqlalchemy import Table, Column, Integer, String, Float, Boolean, ARRAY, Text, ForeignKey

from app.core.db import metadata

# Create a base model mixin class if it doesn't exist
class DBModelMixin:
    """Base mixin for database models"""
    pass

# Database schema
lawyers = Table(
    "lawyers",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String, index=True),
    Column("email", String, unique=True, index=True),
    Column("password_hash", String),
    Column("specialization", String, index=True),
    Column("experience", Integer),
    Column("rating", Float, default=0.0),
    Column("review_count", Integer, default=0),
    Column("online", Boolean, default=False),
    Column("location", String),
    Column("languages", ARRAY(String)),
    Column("profile_picture", String, nullable=True),
    Column("bio", Text, nullable=True),
    Column("verified", Boolean, default=False),
    Column("allow_offline_messages", Boolean, default=True),
    Column("phone", String, nullable=True),
    Column("created_at", String),
    Column("updated_at", String)
)

# Pydantic Models
class LawyerBase(BaseModel):
    name: str
    specialization: str
    location: str
    languages: List[str]

class LawyerCreate(LawyerBase):
    email: EmailStr
    password: str
    experience: int
    bio: Optional[str] = None
    phone: Optional[str] = None
    verified: bool = False
    online: bool = False
    rating: float = 0.0
    reviewCount: int = 0

class LawyerUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[int] = None
    location: Optional[str] = None
    languages: Optional[List[str]] = None
    bio: Optional[str] = None
    profilePicture: Optional[str] = None
    verified: Optional[bool] = None
    allowOfflineMessages: Optional[bool] = None
    phone: Optional[str] = None
    online: Optional[bool] = None

class LawyerInDB(LawyerBase):
    id: int
    email: EmailStr
    password_hash: str
    experience: int
    rating: float
    reviewCount: int
    online: bool
    profilePicture: Optional[str] = None
    bio: Optional[str] = None
    verified: bool
    allowOfflineMessages: bool
    phone: Optional[str] = None
    created_at: str
    updated_at: str

class Lawyer(DBModelMixin):
    id: int
    name: str
    specialization: str
    experience: int
    rating: float
    reviewCount: int
    online: bool
    location: str
    languages: List[str]
    profilePicture: Optional[str] = None
    bio: Optional[str] = None
    verified: bool = False
    allowOfflineMessages: bool = True
    phone: Optional[str] = None
    
    @classmethod
    async def get_all(cls, db):
        """Get all lawyers from the database"""
        query = lawyers.select()
        result = await db.fetch_all(query)
        return [cls.from_db(row) for row in result]
    
    @classmethod
    async def get_by_id(cls, db, lawyer_id: int):
        """Get a lawyer by ID"""
        query = lawyers.select().where(lawyers.c.id == lawyer_id)
        result = await db.fetch_one(query)
        if result:
            return cls.from_db(result)
        return None
    
    @classmethod
    async def get_by_email(cls, db, email: str):
        """Get a lawyer by email"""
        query = lawyers.select().where(lawyers.c.email == email)
        result = await db.fetch_one(query)
        if result:
            return cls.from_db(result)
        return None
    
    @classmethod
    async def create(cls, db, lawyer: LawyerCreate):
        """Create a new lawyer"""
        hashed_password = cls._hash_password(lawyer.password)
        now = datetime.utcnow().isoformat()
        
        lawyer_dict = lawyer.dict(by_alias=True)
        lawyer_dict.pop('password')
        
        values = {
            "name": lawyer.name,
            "email": lawyer.email,
            "password_hash": hashed_password,
            "specialization": lawyer.specialization,
            "experience": lawyer.experience,
            "rating": lawyer.rating,
            "review_count": lawyer.reviewCount,
            "online": lawyer.online,
            "location": lawyer.location,
            "languages": lawyer.languages,
            "bio": lawyer.bio,
            "verified": lawyer.verified,
            "allow_offline_messages": True,
            "phone": lawyer.phone,
            "created_at": now,
            "updated_at": now
        }
        
        query = lawyers.insert().values(**values)
        lawyer_id = await db.execute(query)
        
        return await cls.get_by_id(db, lawyer_id)
    
    @classmethod
    async def update(cls, db, lawyer_id: int, update_data: LawyerUpdate):
        """Update a lawyer"""
        data = update_data.dict(exclude_unset=True)
        values = {}
        
        # Map pydantic model fields to db columns
        field_mapping = {
            "profilePicture": "profile_picture",
            "allowOfflineMessages": "allow_offline_messages",
            "reviewCount": "review_count"
        }
        
        for key, value in data.items():
            db_key = field_mapping.get(key, key.lower())
            values[db_key] = value
        
        values["updated_at"] = datetime.utcnow().isoformat()
        
        query = lawyers.update().where(
            lawyers.c.id == lawyer_id
        ).values(**values)
        
        await db.execute(query)
        return await cls.get_by_id(db, lawyer_id)
    
    @classmethod
    async def delete(cls, db, lawyer_id: int):
        """Delete a lawyer"""
        query = lawyers.delete().where(lawyers.c.id == lawyer_id)
        await db.execute(query)
        return True
    
    @classmethod
    def from_db(cls, row):
        """Convert a database row to a Lawyer model"""
        return cls(
            id=row["id"],
            name=row["name"],
            specialization=row["specialization"],
            experience=row["experience"],
            rating=row["rating"],
            reviewCount=row["review_count"],
            online=row["online"],
            location=row["location"],
            languages=row["languages"],
            profilePicture=row["profile_picture"],
            bio=row["bio"],
            verified=row["verified"],
            allowOfflineMessages=row["allow_offline_messages"],
            phone=row["phone"]
        )
    
    @staticmethod
    def _hash_password(password: str) -> str:
        """Hash a password for storage"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode(), salt)
        return hashed.decode()
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(
            plain_password.encode(),
            hashed_password.encode()
        ) 