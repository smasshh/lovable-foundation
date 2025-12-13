from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    """Schema for user registration."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (no sensitive data)."""
    id: str
    name: str
    email: str
    
    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Schema for authentication response (login/signup)."""
    user: UserResponse
    accessToken: str


class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: str
    exp: int
    iat: int
    type: str
