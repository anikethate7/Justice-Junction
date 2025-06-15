from fastapi import APIRouter, HTTPException, Depends, Body, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
import uuid
from datetime import datetime

from app.config import settings
from app.models.lawyers import Lawyer, LawyerCreate, LawyerUpdate, LawyerInDB
from app.core.db import get_db
from app.utils.auth import get_current_user
from app.utils.storage import upload_file

router = APIRouter()

# --- Models ---
class LawyerResponse(BaseModel):
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

class LawyerRegistration(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    yearsExperience: int
    specialization: str
    bio: Optional[str] = None
    phone: str
    location: str
    languages: List[str]

# --- API Endpoints ---

@router.get("/", response_model=List[LawyerResponse])
async def get_lawyers(
    specialization: Optional[str] = None,
    min_experience: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: str = "rating",
    db = Depends(get_db)
):
    """Get all lawyers with optional filtering"""
    try:
        # Fetch lawyers from database
        lawyers = await Lawyer.get_all(db)
        
        # Apply filters
        if specialization:
            lawyers = [l for l in lawyers if l.specialization == specialization]
        
        if min_experience:
            lawyers = [l for l in lawyers if l.experience >= min_experience]
            
        if search:
            search = search.lower()
            lawyers = [l for l in lawyers if search in l.name.lower() or 
                      search in l.specialization.lower() or 
                      search in l.location.lower()]
        
        # Apply sorting
        if sort_by == "rating":
            lawyers.sort(key=lambda x: x.rating, reverse=True)
        elif sort_by == "experience":
            lawyers.sort(key=lambda x: x.experience, reverse=True)
        elif sort_by == "name":
            lawyers.sort(key=lambda x: x.name)
            
        return lawyers
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching lawyers: {str(e)}"
        )

@router.get("/{lawyer_id}", response_model=LawyerResponse)
async def get_lawyer_by_id(
    lawyer_id: int,
    db = Depends(get_db)
):
    """Get lawyer by ID"""
    try:
        lawyer = await Lawyer.get_by_id(db, lawyer_id)
        if not lawyer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lawyer not found"
            )
        return lawyer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching lawyer: {str(e)}"
        )

@router.post("/register", response_model=LawyerResponse)
async def register_lawyer(
    registration: LawyerRegistration,
    db = Depends(get_db)
):
    """Register a new lawyer"""
    try:
        # Check if email already exists
        existing_lawyer = await Lawyer.get_by_email(db, registration.email)
        if existing_lawyer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create a new lawyer
        lawyer_data = LawyerCreate(
            name=f"{registration.firstName} {registration.lastName}",
            email=registration.email,
            password=registration.password,  # This will be hashed in the model
            specialization=registration.specialization,
            experience=registration.yearsExperience,
            location=registration.location,
            languages=registration.languages,
            bio=registration.bio,
            phone=registration.phone,
            verified=False,  # Lawyers need admin verification
            online=False,
            rating=0.0,
            reviewCount=0
        )
        
        # Save to database
        new_lawyer = await Lawyer.create(db, lawyer_data)
        
        return new_lawyer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering lawyer: {str(e)}"
        )

@router.post("/{lawyer_id}/profile-picture", response_model=LawyerResponse)
async def upload_profile_picture(
    lawyer_id: int,
    file: UploadFile = File(...),
    # In production, uncomment the following line to require authentication
    # current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Upload lawyer profile picture"""
    try:
        # Verify this is the correct lawyer or an admin
        lawyer = await Lawyer.get_by_id(db, lawyer_id)
        if not lawyer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lawyer not found"
            )
        
        # In production, uncomment the following block to check user permissions
        # if current_user.id != lawyer_id and not current_user.is_admin:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Not authorized to update this profile"
        #     )
        
        # Upload file to storage
        filename = f"lawyers/{lawyer_id}/{uuid.uuid4()}{file.filename}"
        profile_pic_url = await upload_file(file, filename)
        
        # Update lawyer profile
        updated_lawyer = await Lawyer.update(
            db, 
            lawyer_id, 
            LawyerUpdate(profilePicture=profile_pic_url)
        )
        
        return updated_lawyer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading profile picture: {str(e)}"
        )

@router.put("/{lawyer_id}", response_model=LawyerResponse)
async def update_lawyer_profile(
    lawyer_id: int,
    update_data: LawyerUpdate,
    # In production, uncomment the following line to require authentication
    # current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Update lawyer profile"""
    try:
        # Verify this is the correct lawyer or an admin
        lawyer = await Lawyer.get_by_id(db, lawyer_id)
        if not lawyer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lawyer not found"
            )
        
        # In production, uncomment the following block to check user permissions
        # if current_user.id != lawyer_id and not current_user.is_admin:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Not authorized to update this profile"
        #     )
        
        # Update lawyer
        updated_lawyer = await Lawyer.update(db, lawyer_id, update_data)
        return updated_lawyer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating lawyer profile: {str(e)}"
        )

@router.delete("/{lawyer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lawyer(
    lawyer_id: int,
    # In production, uncomment the following line to require authentication
    # current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Delete a lawyer (admin only)"""
    try:
        # In production, uncomment the following block to check admin permissions
        # if not current_user.is_admin:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Only admins can delete lawyer accounts"
        #     )
        
        # Check if lawyer exists
        lawyer = await Lawyer.get_by_id(db, lawyer_id)
        if not lawyer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lawyer not found"
            )
        
        # Delete lawyer
        await Lawyer.delete(db, lawyer_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting lawyer: {str(e)}"
        )

@router.post("/{lawyer_id}/verify", response_model=LawyerResponse)
async def verify_lawyer(
    lawyer_id: int,
    # In production, uncomment the following line to require authentication
    # current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Verify a lawyer (admin only)"""
    try:
        # In production, uncomment the following block to check admin permissions
        # if not current_user.is_admin:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Only admins can verify lawyer accounts"
        #     )
        
        # Check if lawyer exists
        lawyer = await Lawyer.get_by_id(db, lawyer_id)
        if not lawyer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lawyer not found"
            )
        
        # Update verification status
        updated_lawyer = await Lawyer.update(
            db, 
            lawyer_id, 
            LawyerUpdate(verified=True)
        )
        
        return updated_lawyer
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying lawyer: {str(e)}"
        ) 