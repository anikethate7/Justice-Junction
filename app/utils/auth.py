from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel

from app.config import settings

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

class User(BaseModel):
    id: int
    email: str
    is_admin: bool = False

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get current user from token
    
    Args:
        token: JWT token
        
    Returns:
        User: Current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode token
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        # Extract user data
        username = payload.get("sub")
        user_id = payload.get("id")
        is_admin = payload.get("is_admin", False)
        
        if username is None or user_id is None:
            raise credentials_exception
            
        token_data = TokenData(username=username, user_id=user_id)
        
    except JWTError:
        raise credentials_exception
        
    # In a real app, you'd fetch the user from the database here
    # For now, we'll just return a User object with the data from the token
    user = User(id=user_id, email=username, is_admin=is_admin)
    
    return user

async def get_current_active_admin(current_user: User = Depends(get_current_user)):
    """
    Get current admin user
    
    Args:
        current_user: Current user
        
    Returns:
        User: Current admin user
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized to perform this action"
        )
    return current_user 