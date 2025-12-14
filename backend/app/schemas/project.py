from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProjectCreate(BaseModel):
    """Schema for creating a project."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = "#3B82F6"


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = None


class ProjectResponse(BaseModel):
    """Schema for project response."""
    id: str
    user_id: str
    name: str
    description: Optional[str]
    color: str
    task_count: int
    created_at: str
    
    class Config:
        from_attributes = True
