import os
import uuid
from fastapi import UploadFile
import aiofiles
from app.config import settings

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

async def upload_file(file: UploadFile, path: str = None) -> str:
    """
    Upload a file to storage
    
    Args:
        file: The file to upload
        path: Optional path within the uploads directory
        
    Returns:
        URL of the uploaded file
    """
    if not path:
        # Generate a unique filename if no path provided
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        path = filename
    
    # Create full file path
    file_path = os.path.join(settings.UPLOAD_DIR, path)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Save the file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Return the URL for the file
    file_url = f"{settings.API_BASE_URL}/uploads/{path}"
    return file_url 